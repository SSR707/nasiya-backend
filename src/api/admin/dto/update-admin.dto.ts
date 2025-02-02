import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}
