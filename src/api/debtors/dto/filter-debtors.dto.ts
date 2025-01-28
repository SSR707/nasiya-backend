import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
  IsNumber,
  IsString,
  IsEnum,
} from 'class-validator';

export enum DebtorSortBy {
  NAME = 'name',
  DEBT_AMOUNT = 'debtAmount',
  DEBT_DATE = 'debtDate',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FilterDebtorsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasOverdueDebt?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  minDebtAmount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxDebtAmount?: number;

  @ApiProperty({ enum: DebtorSortBy, required: false })
  @IsOptional()
  @IsEnum(DebtorSortBy)
  sortBy?: DebtorSortBy;

  @ApiProperty({ enum: SortOrder, required: false })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
