import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtGuard } from '../../common/guard/jwt-auth.guard';
import { StoreStatisticsService } from './store-statistics.service';
import { UserID } from 'src/common';

@ApiTags('store-statistics')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('store-statistics')
export class StoreStatisticsController {
  constructor(private readonly statisticsService: StoreStatisticsService) {}

  @Get('calendar')
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
  // get onde monthly all payments sum

  @Get('main')
  @ApiOperation({ summary: 'Get all debtors debt sum and all debtors count' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'This will get all count of debtors and get all debtors debt sum',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          total_debts: 139880000.293,
          debtors_count: 120,
        },
      },
    },
  })
  async getMainStatistics(@UserID() id: string) {
    return this.statisticsService.mainMenuStatistics(id);
  }

  @Get('late-payments')
  @ApiOperation({ summary: 'Get late payments statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns total number of months debts are late',
  })
  async getLatePayments(@UserID() storeId: string) {
    return this.statisticsService.latePayments(storeId);
  }
}
