import { BaseEntity } from '../../common/database/BaseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Debtor } from './debtor.entity';

@Entity('store')
export class StoreEntity extends BaseEntity {
  @Column({ type: 'varchar', name: 'fullname', nullable: true })
  fullname: string;

  @Column({ type: 'varchar', name: 'login' })
  login: string;

  @Column({ type: 'varchar', name: 'hashed_password' })
  hashed_password: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'wallet',
    default: 0.0,
  })
  wallet: number;

  @Column({ type: 'varchar', name: 'image' })
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

  @Column({ type: 'boolean', name: 'is_active' })
  is_active: boolean;

  @OneToMany(() => Debtor, (debtor) => debtor.store)
  debtors: Debtor[];
}
