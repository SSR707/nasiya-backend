import { Repository } from 'typeorm';
import { StoreEntity } from '../entity/store.entity';
export type StoreRepository = Repository<StoreEntity>;
