import { Repository } from 'typeorm';
import { LikesEntity } from '../entity/like.entity';
export type LikesRepository = Repository<LikesEntity>;
