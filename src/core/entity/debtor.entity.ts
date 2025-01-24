import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../common';
import {
  DebtorImageEntity,
  DebtorPhoneEntity,
  DebtEntity,
  StoreEntity,
  LikesEntity,
} from './';

@Entity('debtors')
export class DebtorEntity extends BaseEntity {
  @Column({ type: 'varchar', name: 'fullname' })
  full_name: string;

  @Column({ type: 'varchar', name: 'phone_number' })
  phone_number: string;

  @Column({ type: 'varchar', name: 'image', nullable: true })
  image: string;

  @Column({ type: 'text', name: 'address' })
  address: string;

  @Column({ type: 'text', name: 'note', nullable: true })
  note: string;

  @Column({ type: 'uuid', name: 'store_id' })
  store_id: string;

  @ManyToOne(() => StoreEntity, (store) => store.debtors)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @OneToMany(() => DebtEntity, (debt) => debt.debtor)
  debts: DebtEntity[];

  @OneToOne(() => LikesEntity, (like) => like.debtor)
  likes: LikesEntity;

  @OneToMany(() => DebtorImageEntity, (image) => image.debtor)
  images: DebtorImageEntity[];

  @OneToMany(() => DebtorPhoneEntity, (phone) => phone.debtor)
  phoneNumbers: DebtorPhoneEntity[];
}
