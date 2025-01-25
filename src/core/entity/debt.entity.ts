import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common';
import { DebtorEntity } from './';
import { DebtImageEntity } from './';

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

  @ManyToOne(() => DebtorEntity, (debtor) => debtor.debts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  debtor: DebtorEntity;

  @OneToMany(() => DebtImageEntity, (image) => image.debt, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  images: DebtImageEntity[];
}