import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';
import { DebtEntity } from './debt.entity';

@Entity()
export class DebtImageEntity extends BaseEntity {
  @Column()
  image: string;

  @Column()
  debt_id: string;

  @ManyToOne(() => DebtEntity, (debt) => debt.images)
  debt: DebtEntity;
}
