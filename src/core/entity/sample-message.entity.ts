import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common';
import { MessageEntity, StoreEntity } from './';
@Entity('sample_message')
export class SampleMessageEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'store_id' })
  store_id: string;

  @Column({ type: 'varchar', name: 'sample' })
  sample: string;

  @ManyToOne(() => StoreEntity, (store) => store.sample_messages)
  @JoinColumn({ name: 'store_id' })
  stores: StoreEntity;

  @OneToMany(() => MessageEntity, (message) => message.sampleMessage)
  messages: MessageEntity[];
}
