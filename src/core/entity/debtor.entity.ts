import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { StoreEntity } from './store.entity';
import { DebtEntity } from './debt.entity';
import { AdminEntity } from './admin.entity';

@Entity('debtors')
export class Debtor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  full_name: string;

  @Column()
  phone_number: string;

  @Column()
  image: string;

  @Column('text')
  address: string;

  @Column('text')
  note: string;

  @ManyToOne(() => StoreEntity, (store) => store.debtors)
  store: StoreEntity;

  @OneToMany(() => DebtEntity, (debt) => debt.debtor)
  debts: DebtEntity[];

  @ManyToOne(() => StoreEntity, (store) => store.debtors)
  stores: StoreEntity[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}
