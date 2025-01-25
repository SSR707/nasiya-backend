import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DebtEntity } from './';
import { BaseEntity } from '../../common';

@Entity('debt_image')
export class DebtImageEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'uuid' })
  debt_id: string;

  @ManyToOne(() => DebtEntity, (debt) => debt.images)
  @JoinColumn({ name: 'debt_id' })
  debt: DebtEntity;
}
