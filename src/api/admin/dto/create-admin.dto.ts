import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IsPhoneNumber } from 'src/common/decorator/is-phone-number';
import { RoleAdmin } from 'src/common/enum';

export class CreateAdminDto {
  @ApiProperty({
    type: String,
    description: 'Fullname of admin',
    example: 'Jhon Doe ',
  })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({
    type: String,
    description: 'Email of admin',
    example: 'test@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

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

  @IsOptional()
  pass_code?: number;

  @ApiProperty({
    type: String,
    description: 'Phone number of admin',
    example: '+9989977XXXXXXX',
  })
  @IsPhoneNumber()
  phone_number?: string;

  @ApiProperty({
    type: String,
    description: 'Role of admin',
    example: 'manager',
    enum: RoleAdmin,
    default: RoleAdmin.MANAGER,
  })
  @IsEnum(RoleAdmin)
  @IsOptional()
  role: RoleAdmin;
}
