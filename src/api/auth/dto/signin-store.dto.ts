import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninStoreDto {
  @ApiProperty({
    type: String,
    description: 'Username of admin',
    example: 'Store001',
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    type: String,
    description: 'Password of admin',
    example: 'Store123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
