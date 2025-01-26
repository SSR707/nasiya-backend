import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common';
import { StoreEntity, DebtorEntity } from './';

@Entity('likes')
export class LikesEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'store_id' })
  store_id: string;

  @Column({ type: 'uuid', name: 'debtor_id' })
  debtor_id: string;

  @ManyToOne(() => StoreEntity, (store) => store.likes)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ManyToOne(() => DebtorEntity, (debtor) => debtor.likes)
  @JoinColumn({ name: 'debtor_id' })
  debtor: DebtorEntity;
}
