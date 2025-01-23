import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Description of the payment',
    example: 'Payment for order #1234',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'Amount to be paid',
    example: 150.75,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;

  @ApiProperty({
    description: 'Payment method',
    example: 'CARD',
  })
  @IsNotEmpty()
  @IsString()
  readonly method: string;
}
