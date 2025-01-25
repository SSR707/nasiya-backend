import { PartialType } from '@nestjs/swagger';
import { CreateSampleMessageDto } from './create-sample-message.dto';

export class UpdateSampleMessageDto extends PartialType(
  CreateSampleMessageDto,
) {}
