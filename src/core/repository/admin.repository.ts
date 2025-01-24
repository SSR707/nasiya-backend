import { Repository } from 'typeorm';
import { AdminEntity } from '../entity';
export type AdminRepository = Repository<AdminEntity>;
