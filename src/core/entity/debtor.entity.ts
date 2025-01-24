import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { StoreEntity } from './store.entity';
import { DebtEntity } from './debt.entity';
import { DebtorImageEntity } from './debtor-image.entity';
import { DebtorPhoneEntity } from './debtor-phone.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';
import { AdminEntity } from './admin.entity';
import { LikesEntity } from './like.entity';

@Entity('debtors')
export class DebtorEntity extends BaseEntity {

  @Column()
  full_name: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  image: string;

  @Column('text')
  address: string;

  @Column('text', { nullable: true })
  note: string;

  @ManyToOne(() => StoreEntity, (store) => store.debtors)
  store: StoreEntity;

  @OneToMany(() => DebtEntity, (debt) => debt.debtor)
  debts: DebtEntity[];

  @OneToOne(() => LikesEntity, (like) => like.debtor)
  likes: LikesEntity;
  
  @OneToMany(() => DebtorImageEntity, image => image.debtor)
  images: DebtorImageEntity[];

  @ManyToOne(() => StoreEntity, (store) => store.debtors)
  stores: StoreEntity[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => DebtorPhoneEntity, phone => phone.debtor)
  phoneNumbers: DebtorPhoneEntity[];
}
