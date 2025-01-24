import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, Not } from 'typeorm';
import { BaseService } from '../../infrastructure/lib/baseService';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto';
import { DebtorEntity } from '../../core/entity/debtor.entity';
import { DebtorImageEntity } from '../../core/entity/debtor-image.entity';
import { DebtorPhoneEntity } from '../../core/entity/debtor-phone.entity';
import { IFindOptions } from '../../infrastructure/lib/baseService/interface';
import { FileService } from '../../infrastructure/lib/file/file.service';
import { DebtEntity } from 'src/core/entity/debt.entity';

@Injectable()
export class DebtorService extends BaseService<CreateDebtorDto, DeepPartial<DebtorEntity>> {
  constructor(
    @InjectRepository(DebtorEntity)
    private readonly debtorRepository: Repository<DebtorEntity>,
    @InjectRepository(DebtorImageEntity)
    private readonly debtorImageRepository: Repository<DebtorImageEntity>,
    @InjectRepository(DebtorPhoneEntity)
    private readonly debtorPhoneRepository: Repository<DebtorPhoneEntity>,
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
      where: { phone_number: createDebtorDto.phone_number }
    });

    if (existingDebtor) {
      throw new BadRequestException('Phone number already registered');
    }

    try {
      const newDebtor = this.debtorRepository.create({
        ...createDebtorDto,
        updated_at: Date.now()
      });

      const savedDebtor = await this.debtorRepository.save(newDebtor);

      return {
        status_code: 201,
        message: 'Debtor created successfully',
        data: savedDebtor,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to create debtor: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const debtor = await this.findOneById(id, {
        relations: ['debts', 'store', 'images', 'phoneNumbers'],
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
          id: Not(id) // Using TypeORM's Not operator
        }
      });

      if (phoneExists) {
        throw new BadRequestException('Phone number already registered to another debtor');
      }
    }

    try {
      await this.debtorRepository.update(id, {
        ...updateDebtorDto,
        updated_at: Date.now()
      });

      const updatedDebtor = await this.findOne(id);
      return {
        status_code: 200,
        message: 'Debtor updated successfully',
        data: updatedDebtor.data
      };
    } catch (error) {
      throw new BadRequestException(`Failed to update debtor: ${error.message}`);
    }
  }

  async findAllActive(options?: IFindOptions<DebtorEntity>) {
    try {
      const debtors = await this.findAll({
        ...options,
        relations: ['debts', 'store'],
        order: {
          created_at: 'DESC'
        }
      });

      return {
        status_code: 200,
        message: 'Debtors retrieved successfully',
        data: debtors.data,
        total: debtors.data.length
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
        relations: ['debts', 'store']
      });

      if (!debtor) {
        throw new NotFoundException(`No debtor found with phone number: ${phone_number}`);
      }

      return debtor;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error searching by phone number: ${error.message}`);
    }
  }

  async getTotalDebt(id: string) {
    const debtor = await this.findOne(id);

    try {
      const debts = debtor.data?.debts || [];
      const totalDebt = debts
        .map(debt => Number(debt.amount))
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
          total_debt: totalDebt
        }
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
      if (debtor.data.image && await this.fileService.existFile(debtor.data.image)) {
        await this.fileService.deleteFile(debtor.data.image);
      }

      // Upload new image
      const imageUrl = await this.fileService.createFile(file);

      // Update debtor with new image
      await this.debtorRepository.update(id, {
        image: imageUrl,
        updated_at: Date.now()
      });

      return {
        status_code: 200,
        message: 'Image uploaded successfully',
        data: { image_url: imageUrl }
      };
    } catch (error) {
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  async addDebtorImage(id: string, file: Express.Multer.File) {
    const debtor = await this.findOne(id);

    try {
      const imageUrl = await this.fileService.createFile(file);
      
      const debtorImage = this.debtorImageRepository.create({
        image: imageUrl,
        debtor_id: id
      });

      await this.debtorImageRepository.save(debtorImage);

      return {
        status_code: 201,
        message: 'Image added successfully',
        data: debtorImage
      };
    } catch (error) {
      throw new BadRequestException(`Failed to add image: ${error.message}`);
    }
  }

  async removeDebtorImage(imageId: string) {
    const image = await this.debtorImageRepository.findOne({
      where: { id: imageId }
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    try {
      if (await this.fileService.existFile(image.image)) {
        await this.fileService.deleteFile(image.image);
      }

      await this.debtorImageRepository.delete(imageId);

      return {
        status_code: 200,
        message: 'Image removed successfully'
      };
    } catch (error) {
      throw new BadRequestException(`Failed to remove image: ${error.message}`);
    }
  }

  async addDebtorPhone(id: string, phone_number: string) {
    const debtor = await this.findOne(id);

    if (!this.isValidPhoneNumber(phone_number)) {
      throw new BadRequestException('Invalid phone number format');
    }

    // Check if phone number already exists
    const existingPhone = await this.debtorPhoneRepository.findOne({
      where: { phone_number }
    });

    if (existingPhone) {
      throw new BadRequestException('Phone number already registered');
    }

    try {
      const debtorPhone = this.debtorPhoneRepository.create({
        phone_number,
        debtor_id: id
      });

      await this.debtorPhoneRepository.save(debtorPhone);

      return {
        status_code: 201,
        message: 'Phone number added successfully',
        data: debtorPhone
      };
    } catch (error) {
      throw new BadRequestException(`Failed to add phone number: ${error.message}`);
    }
  }

  async removeDebtorPhone(phoneId: string) {
    const phone = await this.debtorPhoneRepository.findOne({
      where: { id: phoneId }
    });

    if (!phone) {
      throw new NotFoundException('Phone number not found');
    }

    try {
      await this.debtorPhoneRepository.delete(phoneId);

      return {
        status_code: 200,
        message: 'Phone number removed successfully'
      };
    } catch (error) {
      throw new BadRequestException(`Failed to remove phone number: ${error.message}`);
    }
  }

  async deleteSoft(id: string) {
    const debtor = await this.findOne(id);

    try {
      // Delete image if exists
      if (debtor.data.image && await this.fileService.existFile(debtor.data.image)) {
        await this.fileService.deleteFile(debtor.data.image);
      }

      await this.debtorRepository.delete(id);

      return {
        status_code: 200,
        message: 'Debtor deleted successfully'
      };
    } catch (error) {
      throw new BadRequestException(`Failed to delete debtor: ${error.message}`);
    }
  }

  private isValidPhoneNumber(phone: string): boolean {
    // Uzbekistan phone number format validation
    const phoneRegex = /^\+998[0-9]{9}$/;
    return phoneRegex.test(phone);
  }
}
