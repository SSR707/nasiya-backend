import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
