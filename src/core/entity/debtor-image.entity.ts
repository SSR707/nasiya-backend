import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/database/BaseEntity';
import { DebtorEntity } from './debtor.entity';

@Entity('images_of_debtor')
export class DebtorImageEntity extends BaseEntity {
  @Column()
  image: string;

  @Column()
  debtor_id: string;

  @ManyToOne(() => DebtorEntity, debtor => debtor.images)
  debtor: DebtorEntity;
}
