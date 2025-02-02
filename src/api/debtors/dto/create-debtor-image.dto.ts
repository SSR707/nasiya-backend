import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDebtorImageDto {
  @ApiProperty({
    description: 'The ID of the debtor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  debtor_id: string;

  @ApiProperty({
    description: 'The image file path',
    example: 'uploads/debtors/image1.jpg',
  })
  @IsNotEmpty()
  @IsString()
  image: string;
}
