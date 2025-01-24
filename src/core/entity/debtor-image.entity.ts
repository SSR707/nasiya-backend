import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common';
import { DebtorEntity } from './';

@Entity('images_of_debtor')
export class DebtorImageEntity extends BaseEntity {
  @Column({ type: 'varchar', name: 'image' })
  image: string;

  @Column({ type: 'uuid', name: 'debtor_id' })
  debtor_id: string;

  @ManyToOne(() => DebtorEntity, (debtor) => debtor.images)
  @JoinColumn({ name: 'debtor_id' })
  debtor: DebtorEntity;
}
