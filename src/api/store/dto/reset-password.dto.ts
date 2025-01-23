import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ResetPasswordStoreDto {
  @ApiProperty({
    type: String,
    description: 'Old password of store',
    example: 'Ali007!',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    type: String,
    description: 'Password of store',
    example: 'QWERfY1341@',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  hashed_password: string;
}
