import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common';
import { DebtorEntity } from './';

@Entity('phone_numbers_of_debtor')
export class DebtorPhoneEntity extends BaseEntity {
  @Column({ type: 'varchar', name: 'phone_number' })
  phone_number: string;

  @Column({ type: 'uuid', name: 'debtor_id' })
  debtor_id: string;

  @ManyToOne(() => DebtorEntity, (debtor) => debtor.phoneNumbers)
  @JoinColumn({ name: 'debtor_id' })
  debtor: DebtorEntity;
}
