import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/database/BaseEntity';
import { DebtorEntity } from './debtor.entity';

@Entity('stores')
export class StoreEntity extends BaseEntity {
  @Column()
  login: string;

  @Column()
  hashed_password: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  wallet: number;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => DebtorEntity, debtor => debtor.store)
  debtors: DebtorEntity[];
}
