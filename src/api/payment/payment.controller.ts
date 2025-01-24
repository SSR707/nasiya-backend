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
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto';
import { PaymentType } from '../../common';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created succesfully.' })
  @ApiBody({ type: CreatePaymentDto })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all payments',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'List of payment returned successfully',
  })
  async getAllPayment(@Query() query: any) {
    return await this.paymentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a payment by ID',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'payment found successfully',
  })
  async getPaymentById(@Param('id') id: string) {
    return await this.paymentService.findOneById(id);
  }

  @Get('type/:type')
  @ApiOperation({
    summary: 'Get payments by type',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payments of the specified type returned successfully',
  })
  @ApiParam({
    name: 'type',
    description: 'Payment type (CASH, CARD, BANK_TRANSFER)',
  })
  async getPaymentByType(@Param('type') type: PaymentType) {
    return await this.paymentService.findPaymentsByType(type);
  }

  @Get('debt/:debtId')
  @ApiOperation({
    summary: 'Get payments by Debt ID',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Payments related to the specified Debt ID returned successfully.',
  })
  @ApiParam({ name: 'debtId', description: 'Debt ID related to payments' })
  async getPaymentsByDebtId(@Param('debtId') debtId: string) {
    return await this.paymentService.findPaymentsByDebtId(debtId);
  }

  @Get('date-range')
  @ApiOperation({
    summary: 'Get payments between dates',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payments in the specified date range returned successfully.',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date (YYYY-MM-DD)',
    required: true,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date (YYYY-MM-DD)',
    required: true,
  })
  async getPaymentsBetweenDates(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.paymentService.findPaymentsBetweenDates(
      startDate,
      endDate,
    );
  }

  @Put(':id/type')
  @ApiOperation({
    summary: 'Update payment type',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment type updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Payment not found.',
  })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiQuery({
    name: 'newType',
    description: 'New payment type (CASH, CARD, BANK_TRANSFER)',
    required: true,
  })
  async updatePaymentType(
    @Param('id') id: string,
    @Query('newType') newType: PaymentType,
  ) {
    return await this.paymentService.updatePaymentType(id, newType);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a payment',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment deleted successfully.',
  })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  async deletePayment(@Param('id') id: string) {
    return await this.paymentService.delete(id);
  }

  @Delete('debt/:debtId')
  @ApiOperation({
    summary: 'Delete payments by Debt ID',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Payments related to the specified Debt ID deleted successfully.',
  })
  @ApiParam({
    name: 'debtId',
    description: 'Debt ID related to payments to be deleted',
  })
  async deletePaymentsByDebtId(@Param('debtId') debtId: string) {
    return await this.paymentService.deletePaymentsByDebtId(debtId);
  }
}
