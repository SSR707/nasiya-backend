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
import { log } from 'console';
import { FilterDebtorsDto } from './dto/filter-debtors.dto';

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
      const debtor = await this.debtorRepository.findOne({
        where: { id },
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
      // Update the debtor
      await this.debtorRepository.update(id, {
        ...updateDebtorDto,
        updated_at: Date.now(),
      });

      // Fetch the updated debtor
      const updatedDebtor = await this.debtorRepository.findOne({
        where: { id },
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
    if (!id || !file) {
      throw new BadRequestException('Debtor ID and file are required');
    }

    try {
      const debtor = await this.findOne(id);

      // Delete old image if exists
      if (debtor.image && await this.fileService.existFile(debtor.image)) {
        await this.fileService.deleteFile(debtor.image);
      }

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Check if file is an image
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          
          throw new BadRequestException('Only JPG, PNG and GIF files are allowed');
        }

        // Upload new image
        const uploadedFile = await this.fileService.uploadFile(file, 'debtors');

        if (!uploadedFile || !uploadedFile.path) {
          throw new BadRequestException('Failed to upload image');
        }

        // Update DebtorEntity with new image path
        await queryRunner.manager.update(DebtorEntity, id, {
          image: uploadedFile.path,
          updated_at: Date.now(),
        });

        // Add new image to DebtorImageEntity
        const newImage = this.debtorImageRepository.create({
          debtor_id: id,
          image: uploadedFile.path,
          debtor: debtor,
        });

        await queryRunner.manager.save(DebtorImageEntity, newImage);
        await queryRunner.commitTransaction();

        return {
          status_code: 201,
          message: 'Image uploaded successfully',
          data: {
            image_url: uploadedFile.path,
            debtor_image: newImage,
          },
        };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        if (error instanceof BadRequestException) {
          throw error;
        }
        throw new BadRequestException(`Failed to process image: ${error.message}`);
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error uploading image: ${error.message}`);
    }
  }

  async getDebtorImages(id: string) {
    try {
      const debtor = await this.findOne(id);
      const images = await this.debtorImageRepository.find({
        where: { debtor_id: id },
        order: {
          created_at: { direction: 'DESC' },
        },
      });

      return {
        status_code: 200,
        message: 'Debtor images retrieved successfully',
        data: images,
        total: images.length,
      };
    } catch (error) {
      throw new BadRequestException(`Error fetching images: ${error.message}`);
    }
  }

  async removeDebtorImage(id: string) {
    try {
      const image = await this.debtorImageRepository.findOne({
        where: { id },
      });

      if (!image) {
        throw new NotFoundException('Image not found');
      }

      // Delete file if exists
      if (await this.fileService.existFile(image.image)) {
        await this.fileService.deleteFile(image.image);
      }

      // Remove image from database
      await this.debtorImageRepository.remove(image);

      return {
        status_code: 200,
        message: 'Image removed successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Error removing image: ${error.message}`);
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
  async filterDebtors(storeId: string, filterDto: FilterDebtorsDto){
    const {
      searchTerm,
      isActive,
      hasOverdueDebt,
      minDebtAmount,
      maxDebtAmount,
      sortBy,
      sortOrder
    } = filterDto;

    const query = this.debtorRepository
      .createQueryBuilder('debtor')
      .leftJoinAndSelect('debtor.debts', 'debt')
      .leftJoinAndSelect('debt.payments', 'payment')
      .where('debtor.store_id = :storeId', {storeId});
    
    if(searchTerm){
      query.andWhere(
        '(debtor.full_name ILIKE :searchTerm OR debtor.phone_number ILIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    if (isActive !== undefined) {
      query.andWhere('debtor.is_active = :isActive', { isActive });
    }

    if (hasOverdueDebt) {
      const currentDate = new Date();
      query.andWhere('debt.debt_date < :currentDate', { currentDate });
    }

    if (minDebtAmount !== undefined) {
      query.andWhere('debt.debt_sum >= :minDebtAmount', { minDebtAmount });
    }
    if (maxDebtAmount !== undefined) {
      query.andWhere('debt.debt_sum <= :maxDebtAmount', { maxDebtAmount });
    }
    if (sortBy) {
      const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
      switch (sortBy) {
        case 'name':
          query.orderBy('debtor.full_name', order);
          break;
        case 'debtAmount':
          query.orderBy('debt.debt_sum', order);
          break;
        case 'debtDate':
          query.orderBy('debt.debt_date', order);
          break;
        default:
          query.orderBy('debtor.created_at', 'DESC');
      }
    }

    return query.getMany();

  }
}

