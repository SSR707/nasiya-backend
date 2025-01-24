import { Repository } from 'typeorm';
import { PaymentEntity } from '../entity';
export type PaymentRepository = Repository<PaymentEntity>;
