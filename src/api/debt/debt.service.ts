import {
  BadRequestException,
  Injectable,
  NotFoundException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial } from 'typeorm';
import { BaseService, FileService } from '../../infrastructure';
import {
  DebtEntity,
  DebtImageEntity,
  DebtorEntity,
  DebtorRepository,
  DebtRepository,
  DebtImageRepostiory,
} from '../../core';
import { CreateDebtDto, UpdateDebtDto } from './dto';

@Injectable()
export class DebtService extends BaseService<
  CreateDebtDto,
  DeepPartial<DebtEntity>
> {
  constructor(
    @InjectRepository(DebtEntity)
    private readonly debtRepository: DebtRepository,
    @InjectRepository(DebtorEntity)
    private readonly debtorRepository: DebtorRepository,
    @InjectRepository(DebtImageEntity)
    private readonly debtImageRepository: DebtImageRepostiory,
    private readonly fileService: FileService,
    private readonly dataSource: DataSource,
  ) {
    super(debtRepository);
  }

  // Debts
  async createDebt(createDebtDto: CreateDebtDto) {
    // find debtor by id
    const debtorData = await this.debtorRepository.findOne({
      where: { id: createDebtDto.debtor_id },
    });
    if (!debtorData) {
      throw new NotFoundException('Debtor not found!');
    }

    const month_sum = Math.floor(
      createDebtDto.debt_sum / createDebtDto.debt_period,
    );
    // create debt
    const data = this.debtRepository.create({
      ...createDebtDto,
      initial_debt_period: createDebtDto.debt_period,
      month_sum,
    });
    await this.debtRepository.save(data);

    return {
      status_code: HttpStatus.CREATED,
      message: 'Debt created successfully.',
      data: data,
    };
  }

  async findAllDebts() {
    // find all debts
    const allData = await this.debtRepository.find({
      relations: ['payments'],
    });

    if (allData.length === 0) {
      throw new NotFoundException('No debt in database!');
    }

    return {
      status_code: HttpStatus.OK,
      message: 'Debt fetched.',
      data: allData,
    };
  }

  async getAllMessages(page: number, limit: number) {
    page = (page - 1) * limit;

    const data = await this.getRepository.find({
      skip: page,
      take: limit,
      relations: ['payments'],
    });
    if (data.length == 0) {
      throw new HttpException('not found', 404);
    }
    return {
      status_code: HttpStatus.OK,
      message: `${limit} debts fetched.`,
      data: data,
    };
  }

  async calculateNextPayment(DebtId: string) {
    const debt = await this.findOneById(DebtId);
    const count = Math.floor(debt.data.debt_sum / debt.data.month_sum);
    let debtDate: Date;
    if (debt.data.debt_date instanceof Date) {
      debtDate = new Date(debt.data.debt_date);
    } else if (typeof debt.data.debt_date === 'string') {
      debtDate = new Date(Date.parse(debt.data.debt_date));
    } else if (typeof debt.data.debt_date === 'number') {
      debtDate = new Date(debt.data.debt_date);
    } else {
      throw new Error('Invalid date format');
    }

    const totalMonths = debt.data.initial_debt_period;

    const paidMonths = totalMonths - debt.data.debt_period;
    const paidPercentage = ((paidMonths / totalMonths) * 100).toFixed(2);
    console.log(paidPercentage);

    debtDate.setMonth(debtDate.getMonth() + 1);

    return {
      debtId: DebtId,
      nextMonth:
        debt.data.debt_sum - debt.data.month_sum * count || debt.data.month_sum,
      nextMonths: debt.data.month_sum,
      debt_period: debt.data.debt_period,
      next_pay_date: debtDate,
      paidPercentage,
    };
  }

  async findOneDebtById(id: string) {
    const debtData = await this.debtRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!debtData) {
      throw new NotFoundException('Debt not found!');
    }

    debtData.debt_sum = +debtData.debt_sum;
    return {
      status_code: HttpStatus.OK,
      message: 'Debt found.',
      data: debtData,
    };
  }

  async updateDebtById(id: string, updateDebtDto: UpdateDebtDto) {
    // find debt by id
    const debtData = await this.debtRepository.findOne({
      where: { id },
    });
    if (!debtData) {
      throw new NotFoundException('Debt not found!');
    }

    // update debt by id
    const data = await this.debtRepository.update(id, updateDebtDto);
    if (!data.affected) {
      throw new BadRequestException('Something gone wrong! Try again later.');
    }

    const newDebtData = await this.debtRepository.findOne({
      where: { id },
    });

    return {
      status_code: HttpStatus.OK,
      message: 'Debt updated successfully.',
      data: newDebtData,
    };
  }

  async deleteDebtById(id: string) {
    // find debt
    const debtData = await this.debtRepository.findOne({
      where: { id },
    });
    if (!debtData) {
      throw new NotFoundException('Debt not found!');
    }

    // delete debt
    const data = await this.debtRepository.delete(id);
    if (!data.affected) {
      throw new BadRequestException('Something gone wrong! Try again later.');
    }

    return {
      status_code: HttpStatus.OK,
      message: 'Debt deleted successfully.',
      data: debtData,
    };
  }

  // Image of Debts
  async createDebtImage(id: string, file: Express.Multer.File) {
    // Find debt
    const debtData = await this.debtRepository.findOne({
      where: { id },
    });
    if (!debtData || !file) {
      throw new NotFoundException('Debt ID and file are required!');
    }

    // Start transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if file is an image
      const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Only JPG, PNG and GIF files are allowed',
        );
      }

      // Upload new image
      const uploadFile = await this.fileService.uploadFile(file, 'debts');

      if (!uploadFile || !uploadFile.path) {
        throw new BadRequestException('Failed to upload image');
      }

      const pathImg = 'http://localhost:3133' + '/' + uploadFile.path;
      const newImage = queryRunner.manager.create(DebtImageEntity, {
        image: pathImg,
        debt_id: id,
      });

      await queryRunner.manager.save(DebtImageEntity, newImage);
      await queryRunner.commitTransaction();

      return {
        status_code: HttpStatus.CREATED,
        message: 'Debt image successfully created.',
        data: newImage,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new BadRequestException(
        `Failed to process image: ${error.message}`,
      );
    } finally {
      // End transaction
      await queryRunner.release();
    }
  }

  async uploadDebtImage(file: Express.Multer.File) {
    if (!file) {
      throw new NotFoundException('Debt ID and file are required!');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Only JPG, PNG and GIF files are allowed',
        );
      }

      const uploadFile = await this.fileService.uploadFile(file, 'debts');

      if (!uploadFile || !uploadFile.path) {
        throw new BadRequestException('Failed to upload image');
      }

      const pathImg = 'http://localhost:3133' + '/' + uploadFile.path;

      return {
        status_code: HttpStatus.CREATED,
        message: 'Debt image successfully created.',
        data: {
          image_url: pathImg,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new BadRequestException(
        `Failed to process image: ${error.message}`,
      );
    } finally {
      // End transaction
      await queryRunner.release();
    }
  }

  async createImgDebt(id: string, url: string) {
    try {
      const newImage = this.debtImageRepository.create({
        image: url,
        debt_id: id,
      });
      await this.debtImageRepository.save(newImage);
      return {
        status_code: HttpStatus.OK,
        message: 'Image Add successfully.',
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to process image: ${error.message}`,
      );
    }
  }
  async findDebtImages(id: string) {
    const debtImages = await this.debtImageRepository.find({
      where: { debt_id: id },
      order: {
        created_at: { direction: 'DESC' },
      },
    });
    if (debtImages.length == 0) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
    return {
      status_code: HttpStatus.OK,
      message: 'Debt images retrieved successfully.',
      data: debtImages,
    };
  }

  async deleteDebtImage(id: string) {
    try {
      const imageData = await this.debtImageRepository.findOne({
        where: { id },
      });

      if (!imageData) {
        throw new NotFoundException('Image not found!');
      }

      // Delete file if exists
      if (await this.fileService.existFile(imageData.image)) {
        await this.fileService.deleteFile(imageData.image);
      }

      // Remove Image from database
      await this.debtImageRepository.remove(imageData);

      return {
        status_code: HttpStatus.OK,
        message: 'Image deleted successfully.',
      };
    } catch (error) {
      throw new BadRequestException(`Error deleting image: ${error.message}`);
    }
  }
}
