import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { DebtEntity } from 'src/core/entity/debt.entity';
import { DeepPartial } from 'typeorm';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { InjectRepository } from '@nestjs/typeorm';
import { DebtRepository } from 'src/core/repository/debt.repository';

@Injectable()
export class DebtService extends BaseService<
  CreateDebtDto,
  DeepPartial<DebtEntity>
> {
  constructor(@InjectRepository(DebtEntity) repository: DebtRepository) {
    super(repository);
  }

  create(createDebtDto: CreateDebtDto) {
    return this.getRepository.create(createDebtDto);
  }

  async findAll() {
    const data = await this.getRepository.find();
    return {
      status_code: 200,
      message: 'Debts retrieved successfully',
      data,
    };
  }

  findOne(id: string) {
    return this.getRepository.findOneById(id);
  }

  async update(id: string, updateDebtDto: UpdateDebtDto) {
    const data = await this.getRepository.update(id, updateDebtDto);
    return {
      status_code: 200,
      message: 'Debt updated successfully',
      data,
    };
  }

  remove(id: string) {
    return this.getRepository.delete(id);
  }
}
