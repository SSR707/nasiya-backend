import { Repository } from 'typeorm';
import { MessageEntity } from '../';
export type MessageRepository = Repository<MessageEntity>;
