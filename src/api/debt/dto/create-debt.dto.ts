import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { DebtPeriod } from '../../../common';

export class CreateDebtDto {
  @ApiProperty({
    type: String,
    description: 'Debtor id',
    example: 'd3b2b2b7-1b5e-4c5d-8f4d-2b2b2b7b1e4c',
  })
  @IsNotEmpty()
  @IsUUID()
  debtor_id: string;

  @ApiProperty({
    type: Date,
    description: 'Debt date',
    example: new Date(),
  })
  @IsNotEmpty()
  @IsISO8601()
  debt_date: string;

  @ApiProperty({
    type: Number,
    description: 'Debt period',
    example: DebtPeriod.THREE_MONTHS,
  })
  @IsNotEmpty()
  @IsEnum(DebtPeriod)
  debt_period: DebtPeriod;

  @ApiProperty({ type: Number, description: 'Debt sum', example: 1000 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  debt_sum: number;

  @ApiProperty({
    type: String,
    description: 'Debt description',
    example: 'you must pay for this device for 6 months',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
