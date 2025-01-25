import { PartialType } from '@nestjs/swagger';
import { CreateDebtorDto } from './';

export class UpdateDebtorDto extends PartialType(CreateDebtorDto) {}
