import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AddPasscodeStoreDto {
  @ApiProperty({
    type: Number,
    description: 'Passcode of store',
    example: 1245,
  })
  @IsString()
  passcode: string;
}
