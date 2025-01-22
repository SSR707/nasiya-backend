import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({
    type: String,
    description: 'Username of store',
    example: 'ALI001',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: String,
    description: 'Password of store',
    example: 'Ali007!',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  hashed_password: string;

  @ApiProperty({
    type: Number,
    description: 'Wallet of store ',
    example: 0,
  })
  @IsDecimal()
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
    description: 'Is_Active of store ',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
