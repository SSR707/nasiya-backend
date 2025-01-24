import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IsPhoneNumber, RoleAdmin } from '../../../common';

export class CreateAdminDto {
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
  @IsStrongPassword()
  @IsNotEmpty()
  hashed_password: string;

  @ApiProperty({
    type: String,
    description: 'Phone number of admin',
    example: '+9989977XXXXXXX',
  })
  @IsPhoneNumber()
  phone_number?: string;

  @ApiProperty({
    type: String,
    description: 'ROLE of admin',
    example: 'ADMIN',
    enum: RoleAdmin,
    default: RoleAdmin,
  })
  @IsEnum(RoleAdmin)
  @IsOptional()
  role: RoleAdmin;
}
