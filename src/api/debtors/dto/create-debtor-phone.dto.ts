import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';

export class CreateDebtorPhoneDto {
  @ApiProperty({
    description: 'The ID of the debtor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  debtor_id: string;

  @ApiProperty({
    description: 'Phone number of the debtor',
    example: '+998901234567',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+998\d{9}$/, {
    message: 'Phone number must be in format: +998XXXXXXXXX',
  })
  phone_number: string;
}
