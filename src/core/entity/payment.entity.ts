import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity, PaymentType } from '../../common';
import { DebtEntity } from './debt.entity';

@Entity('payment')
export class PaymentEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'debt_id' })
  debt_id: string;

  @Column({ type: 'decimal', name: 'sum' })
  sum: number;

  @Column({ type: 'date', name: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: PaymentType, default: PaymentType.ONE_MONTH })
  type: PaymentType;

  @ManyToOne(() => DebtEntity, (debt) => debt.payments)
  @JoinColumn({ name: 'debt_id' })
  debt: DebtEntity;
}
