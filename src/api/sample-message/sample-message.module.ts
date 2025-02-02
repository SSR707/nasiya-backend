import { Module } from '@nestjs/common';
import { SampleMessageService } from './sample-message.service';
import { SampleMessageController } from './sample-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleMessageEntity } from 'src/core';
import { CustomJwtModule } from 'src/infrastructure';

@Module({
  imports: [TypeOrmModule.forFeature([SampleMessageEntity]), CustomJwtModule],
  controllers: [SampleMessageController],
  providers: [SampleMessageService],
})
export class SampleMessageModule {}
