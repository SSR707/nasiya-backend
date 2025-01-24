import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoleAdmin } from 'src/common/enum';

export class SigninAdminDto {
  @ApiProperty({
    type: String,
    description: 'Username of admin',
    example: 'Admin001',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: String,
    description: 'Password of admin',
    example: 'Admin123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

}
