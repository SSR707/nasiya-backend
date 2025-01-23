import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/database/BaseEntity';
import { DebtorEntity } from './debtor.entity';

@Entity('phone_numbers_of_debtor')
export class DebtorPhoneEntity extends BaseEntity {
  @Column()
  phone_number: string;

  @Column()
  debtor_id: string;

  @ManyToOne(() => DebtorEntity, debtor => debtor.phoneNumbers)
  debtor: DebtorEntity;
}
