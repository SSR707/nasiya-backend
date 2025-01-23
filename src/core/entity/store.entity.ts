import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/database/BaseEntity';
import { DebtorEntity } from './debtor.entity';

@Entity('stores')
export class StoreEntity extends BaseEntity {
  @Column({ type: 'varchar', name: 'login' })
  login: string;

  @Column()
  hashed_password: string;
  
  @Column({ type: 'decimal',precision: 10, scale: 2, name: 'wallet',default: 0  })
  wallet: number;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => DebtorEntity, debtor => debtor.store)
  debtors: DebtorEntity[];
}
