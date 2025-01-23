import { BaseEntity } from '../../common/database/BaseEntity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Debtor } from './debtor.entity';
import { LikesEntity } from './like.entity';

@Entity('store')
export class StoreEntity extends BaseEntity {
  @Column({ type: 'varchar', name: 'login' })
  login: string;

  @Column({ type: 'varchar', name: 'hashed_password' })
  hashed_password: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'wallet' })
  wallet: number;

  @Column({ type: 'varchar', name: 'image' })
  image: string;

  @Column({ type: 'boolean', name: 'is_active' })
  is_active: boolean;

  @OneToMany(() => Debtor, (debtor) => debtor.store)
  debtors: Debtor[];

  @OneToOne(() => LikesEntity, (like) => like.store)
  likes: LikesEntity;
}
