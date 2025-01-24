import { ApiProperty } from '@nestjs/swagger';
import { PaymentType } from '../../../common';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    type: 'enum',
    example: PaymentType.ONE_MONTH,
    description: 'Payment type',
  })
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty({
    type: Number,
    example: 800000.0,
    description: 'Payment amount',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: '2025-01-24T19:01:11Z',
    description: 'The date in ISO 8601 format',
  })
  @IsDate()
  date: Date;

  @ApiProperty({
    example: '2f711c2e-e5ef-4f49-8b45-45c32d0efa79',
    description: 'Debt ID related to the payment',
  })
  @IsString()
  debt_id: string;
}
