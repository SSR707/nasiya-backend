import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
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
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          totalAmount: 7833333,
          duePayments: [
            {
              debtorName: 'Zufarbek',
              amount: '3333333.00',
            },
            {
              debtorName: 'Zufarbek',
              amount: '2500000.00',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Store not found!',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'Store not found!',
      },
    },
  })
  @ApiQuery({
    name: 'date',
    description: 'date (YYYY-MM-DD)',
    required: true,
    example: '2025-02-01',
  })
  async getDailyStatistics(
    @UserID() storeId: string,
    @Query('date') dateStr: string,
  ) {
    const selectedDate = new Date(dateStr);
    return this.statisticsService.getDuePayments(storeId, selectedDate);
  }

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
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        lateDebts: 2,
      },
    },
  })
  async getLatePayments(@UserID() storeId: string) {
    return this.statisticsService.latePayments(storeId);
  }
}
