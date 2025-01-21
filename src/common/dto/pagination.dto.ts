import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsString()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsString()
  @Type(() => Number)
  page_size: number = 10;
}
