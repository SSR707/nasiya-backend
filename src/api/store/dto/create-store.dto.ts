import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IsPhoneNumber } from '../../../common';

export class CreateStoreDto {
  @ApiProperty({
    type: String,
    description: 'Login of store',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  fullname: string;

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

  @ApiProperty({
    type: Number,
    description: 'Wallet of store ',
    example: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  wallet: number;

  @ApiProperty({
    type: String,
    description: 'Image of store ',
    example: '.jpg',
  })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({
    type: String,
    description: 'PhoneNumber of store ',
    example: '+998995556656',
  })
  @IsPhoneNumber()
  @IsOptional()
  phone_number: string;

  @ApiProperty({
    type: String,
    description: 'Email of store ',
    example: 'example@gmail.com',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Is_Active of store ',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
