import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto';
import { JwtGuard, PaymentType } from '../../common';

@UseGuards(JwtGuard)
@ApiTags('Payments API')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'create a new payment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment created',
    schema: {
      example: {
        status_code: HttpStatus.CREATED,
        message: 'success',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed creating Payment',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on creating super Payment',
      },
    },
  })
  @ApiBody({ type: CreatePaymentDto })
  @Post()
  @ApiBearerAuth()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentService.create(createPaymentDto);
  }

  @ApiOperation({
    summary: 'Get all payments',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All payments fetched successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'Payments fetched successfully',
        data: [
          {
            id: 'b2d4aa27-0768-4456-947f-f8930c294394',
            created_at: '1730288822952',
            updated_at: '1730288797974',
            sum: 5000,
            date: '2025-01-20',
            type: 'ONE_MONTH',
            debt: {
              id: 'd3e1aa34-7659-4897-872f-cf8c9e2f01b2',
              created_at: '1730288822952',
              updated_at: '1730288797974',
              amount: 20000,
              debt_date: '2025-01-15',
              description: 'OK',
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed fetching Payment',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on fetching Payment',
      },
    },
  })
  @Get()
  @ApiBearerAuth()
  async getAllPayment(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return await this.paymentService.findAllPayment(page, limit);
  }


  @ApiOperation({
    summary: 'Get a payment by ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment found successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'Payment found successfully',
        data: {
          id: 'b2d4aa27-0768-4456-947f-f8930c294394',
          created_at: '1730288822952',
          updated_at: '1730288797974',
          sum: 5000,
          date: '2025-01-20',
          type: 'ONE_MONTH',
          debt: {
            id: 'd3e1aa34-7659-4897-872f-cf8c9e2f01b2',
            created_at: '1730288822952',
            updated_at: '1730288797974',
            amount: 20000,
            debt_date: '2025-01-15',
            description: 'OK',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment not found',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'Payment not found',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed edit profile of admin',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on update profile of admin',
      },
    },
  })
  @Get(':id')
  @ApiBearerAuth()
  async getPaymentById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.paymentService.findOneById(id, { relations: ['debt'] });
  }


  @ApiOperation({
    summary: 'Get payments by type',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payments of the specified type returned successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'Payments of the specified type returned successfully',
        data: [
          {
            id: 'b2d4aa27-0768-4456-947f-f8930c294394',
            created_at: '1730288822952',
            updated_at: '1730288797974',
            sum: 5000,
            date: '2025-01-20',
            type: 'ONE_MONTH',
            debt: {
              id: 'd3e1aa34-7659-4897-872f-cf8c9e2f01b2',
              created_at: '1730288822952',
              updated_at: '1730288797974',
              amount: 20000,
              debt_date: '2025-01-15',
              description: 'Automobile repair loan',
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid payment type provided',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message:
          'Invalid payment type provided. Allowed types: ONE_MONTH, MULTI_MONTH, ANY_PAYMENT',
      },
    },
  })
  @ApiParam({
    name: 'type',
    description: 'Payment type (ONE_MONTH, MULTI_MONTH, ANY_PAYMENT)',
    enum: PaymentType,
  })
  @Get('type/:type')
  @ApiBearerAuth()
  async getPaymentByType(@Param('type') type: PaymentType) {
    return await this.paymentService.findPaymentsByType(type);
  }


  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Payments related to the specified Debt ID returned successfully.',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'Payments fetched successfully',
        data: [
          {
            id: 'b2d4aa27-0768-4456-947f-f8930c294394',
            created_at: '1730288822952',
            updated_at: '1730288797974',
            sum: 5000,
            date: '2025-01-20',
            type: 'ONE_MONTH',
            debt: {
              id: 'd3e1aa34-7659-4897-872f-cf8c9e2f01b2',
              created_at: '1730288822952',
              updated_at: '1730288797974',
              amount: 20000,
              debt_date: '2025-01-15',
              description: 'OK',
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `Debtid with id d3e1aa34-7659-4897-872f-cf8c9e2f01b2 not found.`,
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: `Debtid with id d3e1aa34-7659-4897-872f-cf8c9e2f01b2 not found.`,
      },
    },
  })
  @ApiParam({
    name: 'debtId',
    description: 'Debt ID related to payments',
    example: 'd3e1aa34-7659-4897-872f-cf8c9e2f01b2',
  })
  @Get('debt/:debtId')
  @ApiBearerAuth()
  async getPaymentsByDebtId(@Param('debtId') debtId: string) {
    return await this.paymentService.findPaymentsByDebtId(debtId);
  }

  @ApiOperation({
    summary: 'Get payments between dates',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payments in the specified date range returned successfully.',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'Payments fetched successfully',
        data: [
          {
            id: 'b2d4aa27-0768-4456-947f-f8930c294394',
            created_at: '1730288822952',
            updated_at: '1730288797974',
            sum: 5000,
            date: '2025-01-20',
            type: 'ONE_MONTH',
            debt: {
              id: 'd3e1aa34-7659-4897-872f-cf8c9e2f01b2',
              created_at: '1730288822952',
              updated_at: '1730288797974',
              amount: 20000,
              debt_date: '2025-01-15',
              description: 'OK',
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid date range or missing parameters.',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Invalid date range or missing parameters',
      },
    },
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date (YYYY-MM-DD)',
    required: true,
    example: '2025-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date (YYYY-MM-DD)',
    required: true,
    example: '2025-01-31',
  })
  @Get('date-range')
  @ApiBearerAuth()
  async getPaymentsBetweenDates(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.paymentService.findPaymentsBetweenDates(
      startDate,
      endDate,
    );
  }

  
  @ApiOperation({
    summary: 'Update payment type',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment type updated successfully.',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'Payment type updated successfully',
        data: {
          id: 'b2d4aa27-0768-4456-947f-f8930c294394',
          created_at: '1730288822952',
          updated_at: '1730288797974',
          sum: 5000,
          date: '2025-01-20',
          type: 'ONE_MONTH',
          debt: {
            id: 'd3e1aa34-7659-4897-872f-cf8c9e2f01b2',
            created_at: '1730288822952',
            updated_at: '1730288797974',
            amount: 20000,
            debt_date: '2025-01-15',
            description: 'OK',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment not found.',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'Payment not found',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid payment type provided.',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Invalid payment type: UNKNOWN_TYPE.',
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    example: 'b2d4aa27-0768-4456-947f-f8930c294394',
  })
  @ApiQuery({
    name: 'newType',
    description: 'New payment type (e.g., one_month, multi_month, any_payment)',
    required: true,
    enum:PaymentType,
  })
  @Put(':id/type')
  @ApiBearerAuth()
  async updatePaymentType(
    @Param('id') id: string,
    @Query('newType') newType: PaymentType,
  ) {
    return await this.paymentService.updatePaymentType(id, newType);
  }

  
  @ApiOperation({
    summary: 'Delete a payment',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment deleted successfully.',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'Payment deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment not found.',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'Payment not found.',
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    example: 'b2d4aa27-0768-4456-947f-f8930c294394',
  })
  @Delete(':id')
  @ApiBearerAuth()
  async deletePayment(@Param('id') id: string) {
    return await this.paymentService.delete(id);
  }

  
  @ApiOperation({
    summary: 'Delete payments by Debt ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Payments related to the specified Debt ID deleted successfully.',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message:
          'Payments related to the specified Debt ID deleted successfully.',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No payments found for the specified Debt ID.',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'No payments found for the specified Debt ID',
      },
    },
  })
  @ApiParam({
    name: 'debtId',
    description: 'Debt ID related to payments to be deleted',
    example: 'd3e1aa34-7659-4897-872f-cf8c9e2f01b2',
  })
  @Delete('debt/:debtId')
  @ApiBearerAuth()
  async deletePaymentsByDebtId(@Param('debtId') debtId: string) {
    return await this.paymentService.deletePaymentsByDebtId(debtId);
  }
}
