import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  SetMetadata,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/roles.guard';
import { RoleAdmin } from '../../common';
import { StoreStatisticsService } from './store-statistics.service';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@ApiTags('store-statistics')
@Controller('api/v1/store-statistics')
// @UseGuards(JwtGuard, RolesGuard)
@ApiBearerAuth()
export class StoreStatisticsController {
  constructor(private readonly statisticsService: StoreStatisticsService) {}

  @Get(':storeId/daily')
  // @Roles(RoleAdmin.ADMIN)
  @ApiOperation({ summary: 'Get daily store statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns daily statistics for the store',
  })
  async getDailyStatistics(
    @Param('storeId') storeId: string,
    @Query('date') dateStr: string,
  ) {
    const date = dateStr ? new Date(dateStr) : new Date();
    return this.statisticsService.getDailyStoreStatistics(storeId, date);
  }

  @Get(':storeId/monthly')
  @Roles(RoleAdmin.ADMIN)
  @ApiOperation({ summary: 'Get monthly store statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns monthly statistics for the store',
  })
  async getMonthlyStatistics(
    @Param('storeId') storeId: string,
    @Query('year', new ParseIntPipe({ errorHttpStatusCode: 400 })) year: number,
    @Query('month', new ParseIntPipe({ errorHttpStatusCode: 400 })) month: number,
  ) {
    if (month < 1 || month > 12) {
      throw new BadRequestException('Month must be between 1 and 12');
    }
    return this.statisticsService.getMonthlyStoreStatistics(
      storeId,
      year,
      month,
    );
  }

  @Get(':storeId/debtors')
  @Roles(RoleAdmin.ADMIN)
  @ApiOperation({ summary: 'Get debtor statistics for store' })
  @ApiResponse({
    status: 200,
    description: 'Returns detailed debtor statistics for the store',
  })
  async getDebtorStatistics(@Param('storeId') storeId: string) {
    return this.statisticsService.getDebtorStatistics(storeId);
  }

  @Get(':storeId/update-stats')
  @Roles(RoleAdmin.ADMIN)
  @ApiOperation({ summary: 'Update store statistics' })
  @ApiResponse({
    status: 200,
    description: 'Updates and returns latest store statistics',
  })
  async updateStoreStatistics(@Param('storeId') storeId: string) {
    await this.statisticsService.updateStoreStatistics(storeId);
    return this.statisticsService.getDebtorStatistics(storeId);
  }
}
