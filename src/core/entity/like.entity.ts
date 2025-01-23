import { BaseEntity } from 'src/common/database/BaseEntity';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { Debtor } from './debtor.entity';
import { StoreEntity } from './store.entity';

@Entity('likes')
export class LikesEntity extends BaseEntity {
  @OneToOne(() => StoreEntity, (store) => store.likes)
  @JoinColumn({ name: 'store_id'})
  store: StoreEntity;

  @OneToOne(() => Debtor, (debtor) => debtor.likes)
  @JoinColumn({ name: 'debtor_id'})
  debtor: Debtor;
}
