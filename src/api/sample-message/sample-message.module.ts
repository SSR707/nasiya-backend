import { Module } from '@nestjs/common';
import { SampleMessageService } from './sample-message.service';
import { SampleMessageController } from './sample-message.controller';

@Module({
  controllers: [SampleMessageController],
  providers: [SampleMessageService],
})
export class SampleMessageModule {}
