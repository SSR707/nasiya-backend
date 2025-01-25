import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessageEntity } from '../../core/entity/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
