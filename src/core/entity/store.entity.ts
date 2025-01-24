import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/database/BaseEntity';
import { DebtorEntity } from './debtor.entity';

@Entity('stores')
export class StoreEntity extends BaseEntity {
  @Column({ type: 'varchar', name: 'fullname', nullable: true })
  fullname: string;

  @Column({ type: 'varchar', name: 'login' })
  login: string;

  @Column()
  hashed_password: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'wallet',
    default: 0.0,
  })
  
  @Column({ type: 'decimal',precision: 10, scale: 2, name: 'wallet',default: 0  })
  wallet: number;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'varchar', name: 'email', unique: true, nullable: true })
  email: string;

  @Column({
    type: 'varchar',
    name: 'phone_number',
    unique: true,
    nullable: true,
  })
  phone_number: string;

  @Column({ type: 'varchar', name: 'passcode' })
  passcode: string;

  @Column({ type: 'boolean', name: 'is_active',default: false })
  is_active: boolean;

  @OneToMany(() => DebtorEntity, debtor => debtor.store)
  debtors: DebtorEntity[];
}
