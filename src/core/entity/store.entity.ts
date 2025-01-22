import { BaseEntity } from '../../common/database/BaseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Debtor } from './debtor.entity';

@Entity('store')
export class StoreEntity extends BaseEntity {
  @Column({ type: 'varchar', name: 'fullname' })
  login: string;

  @Column({ type: 'varchar', name: 'hashed_password' })
  hashed_password: string;

  @Column({ type: 'decimal', name: 'wallet' })
  wallet: number;

  @Column({ type: 'varchar', name: 'image' })
  image: string;

  @Column({ type: 'boolean', name: 'is_active' })
  is_active: boolean;

  @OneToMany(() => Debtor, (debtor) => debtor.store)
  debtors: Debtor[];
}
