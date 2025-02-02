import { Repository } from 'typeorm';
import { PaymentEntity } from '../';
export type PaymentRepository = Repository<PaymentEntity>;
