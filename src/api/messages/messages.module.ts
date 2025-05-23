import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/core';
import { CustomJwtModule } from 'src/infrastructure';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity]), CustomJwtModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
