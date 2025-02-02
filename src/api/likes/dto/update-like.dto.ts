import { PartialType } from '@nestjs/swagger';
import { CreateLikeDto } from './';

export class UpdateLikeDto extends PartialType(CreateLikeDto) {}
