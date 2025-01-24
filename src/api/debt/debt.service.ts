import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { BaseService } from '../../infrastructure/lib/baseService';
import { DebtEntity, DebtRepository } from '../../core';
import { CreateDebtDto, UpdateDebtDto } from './dto';

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

  async updateProfile(id: string, updateDebtDto: UpdateDebtDto) {
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
