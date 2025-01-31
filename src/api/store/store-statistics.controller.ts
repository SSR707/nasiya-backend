import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtGuard } from '../../common/guard/jwt-auth.guard';
import { StoreStatisticsService } from './store-statistics.service';
import { UserID } from 'src/common';
import { CreateStoreDto } from './dto';

@ApiTags('store-statistics')
@Controller('store-statistics')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class StoreStatisticsController {
  constructor(private readonly statisticsService: StoreStatisticsService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Get daily store statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns daily statistics for the store',
  })
  async getDailyStatistics(
    @UserID() storeId: string,
    @Query('date') dateStr: string,
  ) {
    const date = dateStr ? new Date(dateStr) : new Date();
    return this.statisticsService.getDailyStoreStatistics(storeId, date);
  }

  @Get(':storeId/monthly')
  @ApiOperation({ summary: 'Get monthly store statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns monthly statistics for the store',
  })
  async getMonthlyStatistics(
    @Param('storeId') storeId: string,
    @Query('year', new ParseIntPipe({ errorHttpStatusCode: 400 })) year: number,
    @Query('month', new ParseIntPipe({ errorHttpStatusCode: 400 }))
    month: number,
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
  @ApiOperation({ summary: 'Get debtor statistics for store' })
  @ApiResponse({
    status: 200,
    description: 'Returns detailed debtor statistics for the store',
  })
  async getDebtorStatistics(@Param('storeId') storeId: string) {
    return this.statisticsService.getDebtorStatistics(storeId);
  }

  @Get(':storeId/update-stats')
  @ApiOperation({ summary: 'Update store statistics' })
  @ApiResponse({
    status: 200,
    description: 'Updates and returns latest store statistics',
  })
  async updateStoreStatistics(@Param('storeId') storeId: string) {
    await this.statisticsService.updateStoreStatistics(storeId);
    return this.statisticsService.getDebtorStatistics(storeId);
  }

  @Get(':storeId/late-payments')
  @ApiOperation({ summary: 'Get late payments statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns total number of months debts are late',
  })
  async getLatePayments(@Param('storeId') storeId: string) {
    return this.statisticsService.latePayments(storeId);
  }
}
