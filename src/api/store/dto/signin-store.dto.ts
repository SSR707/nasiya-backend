import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class SignInStoreDto {
  @ApiProperty({
    type: String,
    description: 'Login of store',
    example: 'ALI001',
  })
  @IsString()
  @IsNotEmpty()
  login: string;
  @ApiProperty({
    type: String,
    description: 'Password of store',
    example: 'Ali007!',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
