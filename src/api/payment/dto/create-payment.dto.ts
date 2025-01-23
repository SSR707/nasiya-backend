import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 'CASH', description: 'Payment type (CASH, CARD, BANK_TRANSFER)' })
  type: 'CASH' | 'CARD' | 'BANK_TRANSFER';

  @ApiProperty({ example: 100, description: 'Payment amount' })
  amount: number;

  @ApiProperty({ example: '2023-01-01', description: 'Payment date (YYYY-MM-DD)' })
  date: string;

  @ApiProperty({ example: '1', description: 'Debt ID related to the payment' })
  debt_id: string;
}
