import { PartialType } from '@nestjs/swagger';
import { CreateDebtorPhoneDto } from './create-debtor-phone.dto';

export class UpdateDebtorPhoneDto extends PartialType(CreateDebtorPhoneDto) {}
