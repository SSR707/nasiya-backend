import { PartialType } from '@nestjs/swagger';
import { CreateStoreDto } from './';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}
