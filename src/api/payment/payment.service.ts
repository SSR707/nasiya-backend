import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from 'typeorm';
import { CreatePaymentDto } from './dto';
import { PaymentRepository, PaymentEntity } from '../../core';
import { BaseService } from '../../infrastructure';

@Injectable()
export class PaymentService extends BaseService<
  CreatePaymentDto,
  PaymentEntity
> {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: PaymentRepository,
  ) {
    super(paymentRepository);
  }

  async findPaymentsByType(type: 'CASH' | 'CARD' | 'BANK_TRANSFER') {
    const data = await this.paymentRepository.find({
      where: { type },
    });
    return {
      status_code: 200,
      message: 'success',
      data,
    };
  }

  async findPaymentsByDebtId(debtId: string) {
    const data = await this.paymentRepository.find({
      where: { debt_id: debtId },
    });
    return {
      status_code: 200,
      message: 'success',
      data,
    };
  }

  async findPaymentsBetweenDates(startDate: string, endDate: string) {
    const data = await this.paymentRepository.find({
      where: {
        date: Between(new Date(startDate), new Date(endDate)),
      },
    });

    return {
      status_code: 200,
      message: 'success',
      data,
    };
  }

  async deletePaymentsByDebtId(debtId: string) {
    const result = await this.paymentRepository.delete({ debt_id: debtId });

    return {
      status_code: 200,
      message: 'success',
      deleted_count: result.affected,
    };
  }

  async updatePaymentType(
    id: string,
    newType: 'CASH' | 'CARD' | 'BANK_TRANSFER',
  ) {
    const payment = await this.paymentRepository.findOneBy({ id });
    if (!payment) {
      return {
        status_code: 404,
        message: 'Payment not found',
      };
    }

    payment.type = newType;
    await this.paymentRepository.save(payment);

    return {
      status_code: 200,
      message: 'success',
      data: payment,
    };
  }
}
