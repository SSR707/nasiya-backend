import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
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
}
