import { ApiProperty } from '@nestjs/swagger';

export class CreateSampleMessageDto {
  @ApiProperty({
    type: String,
    example: 'Sample message',
    description: 'Sample message content',
  })
  sample: string;
}
