import { Module } from '@nestjs/common';
import { SampleMessageService } from './sample-message.service';
import { SampleMessageController } from './sample-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleMessageEntity } from 'src/core';

@Module({
  imports: [TypeOrmModule.forFeature([SampleMessageEntity])],
  controllers: [SampleMessageController],
  providers: [SampleMessageService],
})
export class SampleMessageModule {}
