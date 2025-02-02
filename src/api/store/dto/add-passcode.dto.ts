import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PasscodeStoreDto {
  @ApiProperty({
    type: String,
    description: 'Passcode of store',
    example: 1245,
  })
  @IsString()
  passcode: string;
}
