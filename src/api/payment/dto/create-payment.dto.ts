import { ApiProperty } from '@nestjs/swagger';
import { PaymentType } from '../../../common';
import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    type: PaymentType,
    enum: PaymentType,
    enumName: 'PaymentType',
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
  @IsPositive()
  sum: number;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: new Date().toISOString(),
    description: 'The date in ISO 8601 format',
  })
  @IsISO8601()
  @IsOptional()
  date: string;

  @ApiProperty({
    example: '2f711c2e-e5ef-4f49-8b45-45c32d0efa79',
    description: 'Debt ID related to the payment',
  })
  @IsUUID()
  debt_id: string;
}
