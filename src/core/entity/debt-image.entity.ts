import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DebtEntity } from './debt.entity';
import { BaseEntity } from 'src/common';

@Entity()
export class DebtImageEntity extends BaseEntity {
  @Column()
  image: string;

  @Column()
  debt_id: string;

  @ManyToOne(() => DebtEntity, (debt) => debt.images)
  @JoinColumn({ name: 'debt_id' })
  debt: DebtEntity;
}
