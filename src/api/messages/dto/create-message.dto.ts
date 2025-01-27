import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MessageStatus } from 'src/common';

export class CreateMessageDto {
  @ApiProperty({
    type: String,
    example: 'f8a3b2f5-d123-4234-98e9-ff6ab9c8f67d',
    description: 'The ID of the debtor',
  })
  @IsString()
  debtor_id: string;

  @ApiProperty({
    type: String,
    example: 'g5a3b2f5-d123-4234-98e9-ff6ab9c8f67d',
    description: 'The ID of the debtor',
  })
  @IsString()
  @IsOptional()
  store_id: string;

  @ApiProperty({
    type: String,
    example: 'This is a sample message',
    description: 'The content of the message',
  })
  @IsString()
  message: string;

  @ApiProperty({
    type: MessageStatus,
    enum: MessageStatus,
    enumName: 'MessageStatus',
    example: MessageStatus.SENT,
    description: 'The status of the message',
  })
  @IsEnum(MessageStatus)
  status: MessageStatus;

  @ApiProperty({
    type: String,
    example: '02f3adb2-b49e-4bfc-982e-37094773145f',
    description: 'The ID of the sample message',
  })
  @IsString()
  @IsOptional()
  sample_message_id: string;
}
