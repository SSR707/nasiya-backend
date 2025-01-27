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
  MessageEntity,
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

  @Column({ type: 'uuid', name: 'store_id', nullable: true })
  store_id: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  is_active: boolean;

  @ManyToOne(() => StoreEntity, (store) => store.debtors)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @OneToMany(() => DebtEntity, (debt) => debt.debtor)
  debts: DebtEntity[];

  @OneToMany(() => LikesEntity, (like) => like.debtor)
  likes: LikesEntity[];

  @OneToMany(() => DebtorImageEntity, (image) => image.debtor)
  images: DebtorImageEntity[];

  @OneToMany(() => MessageEntity, (message) => message.debtor)
  messages: MessageEntity[];

  @OneToMany(() => DebtorPhoneEntity, (phone) => phone.debtor)
  phoneNumbers: DebtorPhoneEntity[];
}
