import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common';
import {
  DebtorEntity,
  LikesEntity,
  MessageEntity,
  SampleMessageEntity,
} from './';

@Entity('stores')
export class StoreEntity extends BaseEntity {
  @Column({ type: 'varchar', name: 'fullname', nullable: true })
  fullname: string;

  @Column({ type: 'varchar', name: 'login', unique: true })
  login: string;

  @Column({ type: 'varchar', name: 'hashed_password' })
  hashed_password: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'wallet',
    default: 0,
  })
  wallet: number;

  @Column({ type: 'varchar', name: 'image', nullable: true })
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

  @Column({ type: 'varchar', name: 'passcode', nullable: true })
  passcode: string;

  @Column({ type: 'boolean', name: 'is_active', default: false })
  is_active: boolean;

  @OneToMany(() => LikesEntity, (like) => like.store)
  likes: LikesEntity[];

  @OneToMany(() => DebtorEntity, (debtor) => debtor.store)
  debtors: DebtorEntity[];

  @OneToMany(() => SampleMessageEntity, (sample) => sample.stores)
  sample_messages: SampleMessageEntity[];

  @OneToMany(() => MessageEntity, (sample) => sample.store)
  messages: MessageEntity[];
}
