import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity, DebtPeriod } from '../../common';
import { DebtorEntity } from './debtor.entity';
import { DebtImageEntity } from './debt-image.entity';
import { PaymentEntity } from './payment.entity';

@Entity('debts')
export class DebtEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  debtor_id: string;

  @Column({ type: 'timestamp' })
  debt_date: Date;

  @Column({ type: 'decimal' })
  debt_sum: number;

  @Column({ type: 'enum', enum: DebtPeriod })
  debt_period: DebtPeriod;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => DebtorEntity, (debtor) => debtor.debts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'debtor_id' })
  debtor: DebtorEntity;

  @OneToMany(() => DebtImageEntity, (image) => image.debt, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  images: DebtImageEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.debt)
  payments: PaymentEntity[];
}
