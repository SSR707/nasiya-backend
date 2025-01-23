import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/database/BaseEntity';

@Entity({ name: 'payment' }) // Jadval nomini aniqlash
export class Payment extends BaseEntity {
  @Column({ type: 'uuid' })
  debt_id: string;

  @Column({ type: 'decimal' })
  sum: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: ['CASH', 'CARD', 'BANK_TRANSFER'] })
  type: 'CASH' | 'CARD' | 'BANK_TRANSFER';
}
