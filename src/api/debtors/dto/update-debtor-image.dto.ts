import { PartialType } from '@nestjs/swagger';
import { CreateDebtorImageDto } from './create-debtor-image.dto';

export class UpdateDebtorImageDto extends PartialType(CreateDebtorImageDto) {}
