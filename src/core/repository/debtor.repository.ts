import { Repository } from 'typeorm';
import { DebtorEntity } from '../entity/debtor.entity';
export type DebtorRepository = Repository<DebtorEntity>
