import { DebtPeriod } from '../../common/enum';
import { BaseEntity } from '../../common/database/BaseEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
// import { DebtorEntity } from './debtor.entity';

@Entity('debts')
export class DebtEntity extends BaseEntity {
  //   @ManyToOne(() => DebtorEntity, (debtor) => debtor.debts, { eager: true })
  //   debtor_id: DebtorEntity;

  @Column({ type: 'timestamp', name: 'debt_date' })
  debt_date: Date;

  @Column({ type: 'enum', enum: DebtPeriod, name: 'debt_period' })
  debt_period: DebtPeriod;

  @Column({ type: 'decimal', name: 'debt_sum' })
  debt_sum: number;

  @Column({ type: 'varchar', name: 'description' })
  description: string;
}
