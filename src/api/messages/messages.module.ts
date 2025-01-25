import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/core';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity])],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
