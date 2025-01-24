import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/database/BaseEntity';
import { DebtorEntity } from './debtor.entity';
import { PaymentEntity } from './payment.entity';

@Entity('debts')
export class DebtEntity extends BaseEntity {
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  debtor_id: string;

  @Column({ type: 'timestamp' })
  debt_date: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => DebtorEntity, (debtor) => debtor.debts)
  debtor: DebtorEntity;

  @OneToMany(() => PaymentEntity, (debtor) => debtor.debt)
  payments: PaymentEntity[];
}
