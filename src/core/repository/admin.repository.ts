import { Repository } from 'typeorm';
import { AdminEntity } from '../entity/admin.entity';
export type AdminRepository = Repository<AdminEntity>;
