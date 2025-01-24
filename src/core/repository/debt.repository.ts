import { Repository } from 'typeorm';
import { DebtEntity } from '../entity';
export type DebtRepository = Repository<DebtEntity>;
