import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Not, DataSource } from 'typeorm';
import {
  UpdateDebtorDto,
  CreateDebtorDto,
  CreateDebtorImageDto,
  CreateDebtorPhoneDto,
} from './dto';
import {
  DebtorImageEntity,
  DebtorPhoneEntity,
  DebtorEntity,
  DebtorRepository,
  DebtorImageRepository,
  DebtorPhoneNumberRepository,
} from '../../core';
import { FileService, BaseService, IFindOptions } from '../../infrastructure';

@Injectable()
export class DebtorService extends BaseService<
  CreateDebtorDto,
  DeepPartial<DebtorEntity>
> {
  constructor(
    @InjectRepository(DebtorEntity)
    private readonly debtorRepository: DebtorRepository,
    @InjectRepository(DebtorImageEntity)
    private readonly debtorImageRepository: DebtorImageRepository,
    @InjectRepository(DebtorPhoneEntity)
    private readonly debtorPhoneRepository: DebtorPhoneNumberRepository,
    private readonly fileService: FileService,
    private readonly dataSource: DataSource,
  ) {
    super(debtorRepository);
  }

  async create(createDebtorDto: CreateDebtorDto) {
    // Validate phone number format
    if (!this.isValidPhoneNumber(createDebtorDto.phone_number)) {
      throw new BadRequestException('Invalid phone number format');
    }

    // Check if phone number already exists
    const existingDebtor = await this.debtorRepository.findOne({
      where: { phone_number: createDebtorDto.phone_number },
    });

    if (existingDebtor) {
      throw new BadRequestException('Phone number already registered');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newDebtor = this.debtorRepository.create({
        ...createDebtorDto,
        updated_at: Date.now(),
      });

      const savedDebtor = await queryRunner.manager.save(newDebtor);

      await queryRunner.commitTransaction();

      return {
        status_code: 201,
        message: 'Debtor created successfully',
        data: savedDebtor,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        `Failed to create debtor: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: string, relations: string[] = []): Promise<any> {
    try {
      const debtor = await this.findOneById(id, {
        relations: relations,
      });

      if (!debtor) {
        throw new NotFoundException(`Debtor with ID ${id} not found`);
      }

      return debtor;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error fetching debtor: ${error.message}`);
    }
  }

  async getAllMessages(
    options?: IFindOptions<DebtorEntity>,
    relations: string[] = [],
  ): Promise<any> {
    try {
      const debtors = await this.debtorRepository.find({
        ...options,
        relations: relations,
      });

      return {
        status_code: 200,
        message: 'Debtors retrieved successfully',
        data: debtors,
        total: debtors.length,
      };
    } catch (error) {
      throw new BadRequestException(`Error fetching debtors: ${error.message}`);
    }
  }

  async update(id: string, updateDebtorDto: UpdateDebtorDto) {
    const existingDebtor = await this.findOne(id);

    // If phone number is being updated, check if it's unique
    if (updateDebtorDto.phone_number) {
      if (!this.isValidPhoneNumber(updateDebtorDto.phone_number)) {
        throw new BadRequestException('Invalid phone number format');
      }

      const phoneExists = await this.debtorRepository.findOne({
        where: {
          phone_number: updateDebtorDto.phone_number,
          id: Not(id),
        },
      });

      if (phoneExists) {
        throw new BadRequestException('Phone number already registered');
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedDebtor = await queryRunner.manager.update(DebtorEntity, id, {
        ...updateDebtorDto,
        updated_at: Date.now(),
      });

      await queryRunner.commitTransaction();

      return {
        status_code: 200,
        message: 'Debtor updated successfully',
        data: updatedDebtor,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        `Failed to update debtor: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAllActive(
    options?: IFindOptions<DebtorEntity>,
    relations: string[] = [],
  ): Promise<any> {
    try {
      const findOptions = {
        ...options,
        relations: relations,
        where: {
          ...(options?.where || {}),
          is_active: true,
        },
        order: {
          created_at: options?.order?.created_at || { direction: 'DESC' },
          ...(options?.order || {}),
        },
      };

      const debtors = await this.debtorRepository.find(findOptions);

      return {
        status_code: 200,
        message: 'Debtors retrieved successfully',
        data: debtors,
        total: debtors.length,
      };
    } catch (error) {
      throw new BadRequestException(`Error fetching debtors: ${error.message}`);
    }
  }

  async findByPhoneNumber(phone_number: string) {
    if (!this.isValidPhoneNumber(phone_number)) {
      throw new BadRequestException('Invalid phone number format');
    }

    try {
      const debtor = await this.findOneBy({
        where: { phone_number },
        relations: ['debts', 'store'],
      });

      if (!debtor) {
        throw new NotFoundException(
          `No debtor found with phone number: ${phone_number}`,
        );
      }

      return debtor;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Error searching by phone number: ${error.message}`,
      );
    }
  }

  async getTotalDebt(id: string) {
    const debtor = await this.findOne(id);

    try {
      const debts = debtor.data?.debts || [];
      const totalDebt = debts
        .map((debt) => Number(debt.amount))
        .reduce((sum, amount) => {
          if (isNaN(amount)) {
            throw new Error(`Invalid debt amount found: ${amount}`);
          }
          return sum + amount;
        }, 0);

      console.log(`Total Debt: ${totalDebt}`);

      return {
        status_code: 200,
        message: 'Total debt calculated successfully',
        data: {
          total_debt: totalDebt,
        },
      };
    } catch (error) {
      console.error(`Error calculating total debt: ${error.message}`);
      throw error;
    }
  }

  async uploadDebtorImage(id: string, file: Express.Multer.File) {
    try {
      const debtor = await this.findOne(id);

      
      // Eski rasmni o'chirish
      if (debtor.image && await this.fileService.existFile(debtor.image)) {
        await this.fileService.deleteFile(debtor.image);
      }


      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();


      try {
        // Yangi rasmni yuklash
        const uploadedFile = await this.fileService.uploadFile(file, 'debtors');

        // DebtorEntity jadvalida asosiy rasm yo'lini yangilash
        await queryRunner.manager.update(DebtorEntity, id, {
          image: uploadedFile.path,
          updated_at: Date.now(),
        });

        // DebtorImageEntity jadvaliga qo'shimcha rasm qo'shish
        const newImage = this.debtorImageRepository.create({
          debtor_id: id,
          image: uploadedFile.path,
          debtor: debtor
        });

        await queryRunner.manager.save(newImage);
        await queryRunner.commitTransaction();

        return {
          status_code: 201,
          message: 'Rasm muvaffaqiyatli yuklandi',
          data: {
            image_url: uploadedFile.path,
            debtor_image: newImage
          }
        };

      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }

    } catch (error) {
      throw new BadRequestException(`Rasmni yuklashda xatolik: ${error.message}`);
    }
  }

  async getDebtorImages(id: string) {
    try {
      const debtor = await this.findOne(id);
      const images = await this.debtorImageRepository.find({
        where: { debtor_id: id },
        order: {
          created_at: { direction: 'DESC' }
        }
      });

      return {
        status_code: 200,
        message: 'Debtor rasmlar ro\'yxati olindi',
        data: images,
        total: images.length
      };
    } catch (error) {
      throw new BadRequestException(`Rasmlarni olishda xatolik: ${error.message}`);
    }
  }

  async removeDebtorImage(id: string) {
    try {
      const image = await this.debtorImageRepository.findOne({ 
        where: { id }
      });

      if (!image) {
        throw new NotFoundException('Rasm topilmadi');
      }

      // Faylni o'chirish
      if (await this.fileService.existFile(image.image)) {
        await this.fileService.deleteFile(image.image);
      }

      // Ma'lumotlar bazasidan o'chirish
      await this.debtorImageRepository.remove(image);

      return {
        status_code: 200,
        message: 'Rasm muvaffaqiyatli o\'chirildi'
      };
    } catch (error) {
      throw new BadRequestException(`Rasmni o'chirishda xatolik: ${error.message}`);
    }
  }

  async addDebtorImage(createDebtorImageDto: CreateDebtorImageDto) {
    const debtor = await this.findOne(createDebtorImageDto.debtor_id);

    const newImage = this.debtorImageRepository.create({
      ...createDebtorImageDto,
      debtor: debtor.data,
    });

    await this.debtorImageRepository.save(newImage);

    return {
      status_code: 201,
      message: 'Debtor image added successfully',
      data: newImage,
    };
  }

  async addDebtorPhone(createDebtorPhoneDto: CreateDebtorPhoneDto) {
    try {
      // Validate phone number format
      if (!this.isValidPhoneNumber(createDebtorPhoneDto.phone_number)) {
        throw new BadRequestException('Invalid phone number format');
      }

      // Check if phone number already exists
      const existingPhone = await this.debtorPhoneRepository.findOne({
        where: { phone_number: createDebtorPhoneDto.phone_number },
      });

      if (existingPhone) {
        throw new BadRequestException('Phone number already registered');
      }

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const newPhone = this.debtorPhoneRepository.create({
          ...createDebtorPhoneDto,
          updated_at: Date.now(),
        });

        const savedPhone = await queryRunner.manager.save(newPhone);

        await queryRunner.commitTransaction();

        return {
          status_code: 201,
          message: 'Phone number added successfully',
          data: savedPhone,
        };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      throw new BadRequestException(
        `Failed to add phone number: ${error.message}`,
      );
    }
  }

  async removeDebtorPhone(id: string) {
    try {
      const phone = await this.debtorPhoneRepository.findOne({
        where: { id },
      });

      if (!phone) {
        throw new NotFoundException('Phone number not found');
      }

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await queryRunner.manager.remove(DebtorPhoneEntity, phone);

        await queryRunner.commitTransaction();

        return {
          status_code: 200,
          message: 'Phone number removed successfully',
        };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      throw new BadRequestException(
        `Failed to remove phone number: ${error.message}`,
      );
    }
  }

  async getDebtorPhones(id: string) {
    const debtor = await this.findOne(id);
    const phones = await this.debtorPhoneRepository.find({
      where: { debtor_id: id },
    });

    return {
      status_code: 200,
      message: 'Debtor phone numbers retrieved successfully',
      data: phones,
    };
  }

  async deleteSoft(id: string) {
    const debtor = await this.findOne(id);

    try {
      // Delete image if exists
      if (
        debtor.data.image &&
        (await this.fileService.existFile(debtor.data.image))
      ) {
        await this.fileService.deleteFile(debtor.data.image);
      }

      await this.debtorRepository.delete(id);

      return {
        status_code: 200,
        message: 'Debtor deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete debtor: ${error.message}`,
      );
    }
  }

  private isValidPhoneNumber(phone: string): boolean {
    // Uzbekistan phone number format validation
    const phoneRegex = /^\+998[0-9]{9}$/;
    return phoneRegex.test(phone);
  }
}
