import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Not } from 'typeorm';
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

    try {
      const newDebtor = this.debtorRepository.create({
        ...createDebtorDto,
        updated_at: Date.now(),
      });

      const savedDebtor = await this.debtorRepository.save(newDebtor);

      return {
        status_code: 201,
        message: 'Debtor created successfully',
        data: savedDebtor,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create debtor: ${error.message}`,
      );
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

  async findAll(
    options?: IFindOptions,
    relations: string[] = [],
  ): Promise<any> {
    try {
      const debtors = await this.findAll({
        ...options,
        relations: relations,
      });

      return {
        status_code: 200,
        message: 'Debtors retrieved successfully',
        data: debtors.data,
        total: debtors.data.length,
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
          id: Not(id), // Using TypeORM's Not operator
        },
      });

      if (phoneExists) {
        throw new BadRequestException(
          'Phone number already registered to another debtor',
        );
      }
    }

    try {
      await this.debtorRepository.update(id, {
        ...updateDebtorDto,
        updated_at: Date.now(),
      });

      const updatedDebtor = await this.findOne(id);
      return {
        status_code: 200,
        message: 'Debtor updated successfully',
        data: updatedDebtor.data,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to update debtor: ${error.message}`,
      );
    }
  }

  async findAllActive(
    options?: IFindOptions,
    relations: string[] = [],
  ): Promise<any> {
    try {
      const debtors = await this.findAll({
        ...options,
        relations: relations,
        order: {
          created_at: 'DESC',
        },
      });

      return {
        status_code: 200,
        message: 'Debtors retrieved successfully',
        data: debtors.data,
        total: debtors.data.length,
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

  async uploadImage(id: string, file: Express.Multer.File) {
    const debtor = await this.findOne(id);

    try {
      // Delete old image if exists
      if (
        debtor.data.image &&
        (await this.fileService.existFile(debtor.data.image))
      ) {
        await this.fileService.deleteFile(debtor.data.image);
      }

      // Upload new image
      const imageUrl = await this.fileService.createFile(file);

      // Update debtor with new image
      await this.debtorRepository.update(id, {
        image: imageUrl,
        updated_at: Date.now(),
      });

      return {
        status_code: 200,
        message: 'Image uploaded successfully',
        data: { image_url: imageUrl },
      };
    } catch (error) {
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
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

  async removeDebtorImage(id: string) {
    const image = await this.debtorImageRepository.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException('Debtor image not found');
    }

    await this.debtorImageRepository.softDelete(id);

    return {
      status_code: 200,
      message: 'Debtor image removed successfully',
    };
  }

  async uploadDebtorImage(id: string, file: Express.Multer.File) {
    const debtor = await this.findOne(id);

    try {
      const uploadedFile = await this.fileService.uploadFile(file, 'debtors');

      const createImageDto: CreateDebtorImageDto = {
        debtor_id: id,
        image: uploadedFile.path,
      };

      return this.addDebtorImage(createImageDto);
    } catch (error) {
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  async addDebtorPhone(createDebtorPhoneDto: CreateDebtorPhoneDto) {
    const debtor = await this.findOne(createDebtorPhoneDto.debtor_id);

    // Check if phone number already exists
    const existingPhone = await this.debtorPhoneRepository.findOne({
      where: { phone_number: createDebtorPhoneDto.phone_number },
    });

    if (existingPhone) {
      throw new BadRequestException('Phone number already exists');
    }

    const newPhone = this.debtorPhoneRepository.create({
      ...createDebtorPhoneDto,
      debtor: debtor.data,
    });

    await this.debtorPhoneRepository.save(newPhone);

    return {
      status_code: 201,
      message: 'Debtor phone number added successfully',
      data: newPhone,
    };
  }

  async removeDebtorPhone(id: string) {
    const phone = await this.debtorPhoneRepository.findOne({ where: { id } });
    if (!phone) {
      throw new NotFoundException('Debtor phone number not found');
    }

    await this.debtorPhoneRepository.softDelete(id);

    return {
      status_code: 200,
      message: 'Debtor phone number removed successfully',
    };
  }

  async getDebtorImages(id: string) {
    const debtor = await this.findOne(id);
    const images = await this.debtorImageRepository.find({
      where: { debtor_id: id },
    });

    return {
      status_code: 200,
      message: 'Debtor images retrieved successfully',
      data: images,
    };
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
