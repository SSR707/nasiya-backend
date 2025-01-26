import { HttpStatus, Injectable } from '@nestjs/common';
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

  async create(createDebtDto: CreateDebtDto) {
    const debt = this.getRepository.create(createDebtDto)
    await this.getRepository.save(debt)
    return { status_code: HttpStatus.CREATED, message: 'success', data: debt };
  }

  async getAllMessages(page: number, limit:number) {
    page = (page -1 )* limit
    const data = await this.getRepository.find({skip :page , take : limit ,relations:['payments']});
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
