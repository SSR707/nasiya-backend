import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity, MessageStatus } from '../../common';
import { DebtorEntity, StoreEntity, SampleMessageEntity } from './';

@Entity('message')
export class MessageEntity extends BaseEntity {
  @Column({ type: 'text', name: 'message' })
  message: string;
  @Column({
    type: 'enum',
    enum: MessageStatus,
    name: 'status',
    default: MessageStatus.SENT,
  })
  status: MessageStatus;
  @Column({ type: 'uuid', name: 'store_id' })
  store_id: string;

  @Column({ type: 'uuid', name: 'debtor_id' })
  debtor_id: string;

  @Column({ type: 'uuid', name: 'sample_message_id', nullable: true })
  sample_message_id: string;

  @ManyToOne(() => StoreEntity, (store) => store.messages)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ManyToOne(() => DebtorEntity, (debtor) => debtor.messages)
  @JoinColumn({ name: 'debtor_id' })
  debtor: DebtorEntity;

  @ManyToOne(
    () => SampleMessageEntity,
    (sampleMessage) => sampleMessage.messages,
  )
  @JoinColumn({ name: 'sample_message_id' })
  sampleMessage: SampleMessageEntity;
}
