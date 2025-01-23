import { Repository } from 'typeorm';
import { Debtor } from '../entity/debtor.entity';
export type DebtorRepository = Repository<Debtor>
