import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDebtorDto {
  @ApiProperty({ example: 'Zufarbek' })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({ example: '+998977777777' })
  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @ApiProperty({ example: 'https://www.pinterest.com/pin/844776842600675743/' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 'Tashkent, Uzbekistan' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'Some notes about the debtor' })
  @IsOptional()
  @IsString()
  note?: string;
}
