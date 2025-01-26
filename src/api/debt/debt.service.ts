import {
  BadRequestException,
  Injectable,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { BaseService } from '../../infrastructure/lib/baseService';
import {
  DebtEntity,
  DebtImageEntity,
  DebtorEntity,
  DebtorRepository,
  DebtRepository,
} from '../../core';
import { CreateDebtDto, UpdateDebtDto } from './dto';
import { DebtImageRepostiory } from 'src/core/repository/debt.image.repository';

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
  ) {
    super(debtRepository);
  }

  async createDebt(createDebtDto: CreateDebtDto) {
    // find debtor by id
    const debtorData = await this.debtorRepository.findOne({
      where: { id: createDebtDto.debtor_id },
    });
    if (!debtorData) {
      throw new NotFoundException('Debtor not found!');
    }

    // create debt
    const data = this.debtRepository.create(createDebtDto);
    await this.debtRepository.save(data);

    return {
      status_code: HttpStatus.CREATED,
      message: 'Debt created successfully.',
      data: data,
    };
  }

  async findAllDebts() {
    // find all debts
    const allData = await this.debtRepository.find();

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

    return {
      status_code: HttpStatus.OK,
      message: `${limit} debts fetched.`,
      data: data,
    };
  }

  async findOneDebtById(id: string) {
    const debtData = await this.debtRepository.findOne({
      where: { id },
    });
    if (!debtData) {
      throw new NotFoundException('Debt not found!');
    }

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
}
