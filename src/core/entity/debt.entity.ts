import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity, DebtPeriod } from '../../common';
import { DebtImageEntity, DebtorEntity, PaymentEntity } from './';

@Entity('debts')
export class DebtEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  debtor_id: string;

  @Column({ type: 'timestamp' })
  debt_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  debt_sum: number;

  @Column({ type: 'enum', enum: DebtPeriod })
  debt_period: DebtPeriod;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => PaymentEntity, (payment) => payment.debt)
  payments: PaymentEntity[];

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
}
