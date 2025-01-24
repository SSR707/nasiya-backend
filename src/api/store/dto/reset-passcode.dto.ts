import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasscodeStoreDto {
  @ApiProperty({
    type: String,
    description: 'Old Passcode of store',
    example: 1245,
  })
  @IsString()
  @IsNotEmpty()
  oldPasscode: string;

  @ApiProperty({
    type: String,
    description: 'New Passcode of store',
    example: 9889,
  })
  @IsString()
  @IsNotEmpty()
  passcode: string;
}
