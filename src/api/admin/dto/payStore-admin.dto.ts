import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class PayStoreDto {
  @ApiProperty({
    type: String,
    description: 'Store id',
    example: '2f711c2e-e5ef-4f49-8b45-45c32d0efa79',
  })
  @IsUUID()
  @IsNotEmpty()
  store_id: string;

  @ApiProperty({
    type: Number,
    description: 'Pay sum',
    example: 0.0,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  sum: number;
}
