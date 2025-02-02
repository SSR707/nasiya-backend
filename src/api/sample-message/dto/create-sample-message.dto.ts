import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSampleMessageDto {
  @ApiProperty({
    type: String,
    example: '9a3efe3a-186c-4759-ab1235-1351324',
    description: 'Store ID',
  })
  @IsOptional()
  @IsUUID()
  store_id: string;
  @ApiProperty({
    type: String,
    example: 'Sample message',
    description: 'Sample message content',
  })
  @IsString()
  sample: string;
}
