import { Repository } from 'typeorm';
import { DebtEntity } from '../entity/debt.entity';
export type DebtRepository = Repository<DebtEntity>;
