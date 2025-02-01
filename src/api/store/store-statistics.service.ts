import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import {
  StoreEntity,
  DebtEntity,
  PaymentEntity,
  DebtorEntity,
} from '../../core/entity';
import { AllExceptionsFilter } from 'src/infrastructure';

@Injectable()
export class StoreStatisticsService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
    @InjectRepository(DebtEntity)
    private readonly debtRepository: Repository<DebtEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(DebtorEntity)
    private readonly debtorRepository: Repository<DebtorEntity>,
  ) {}

  async getDuePayments(storeId: string, selectedDate: Date) {
    const allStoreData = await this.storeRepository.findOne({
      where: { id: storeId },
      select: {
        debtors: {
          id: true,
          full_name: true,
          debts: {
            id: true,
            debt_sum: true,
            month_sum: true,
            debt_period: true,
            debt_date: true,
          },
        },
      },
      relations: ['debtors', 'debtors.debts'],
    });

    if (!allStoreData) return { totalAmount: 0, duePayments: [] };

    const duePayments = [];
    let totalAmount: number = 0;

    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = selectedDate.getDate();
    
    for (const debtor of allStoreData.debtors) {
      for (const debt of debtor.debts) {
        let currentPaymentDate = new Date(debt.debt_date);

        for (let i = 0; i < debt.debt_period; i++) {
          const paymentYear = currentPaymentDate.getFullYear();
          const paymentMonth = currentPaymentDate.getMonth();
          const paymentDay = currentPaymentDate.getDate();

          if (paymentYear === selectedYear && paymentMonth === selectedMonth) {
            totalAmount += +debt.month_sum;
          }
          if (
            paymentYear === selectedYear &&
            paymentMonth === selectedMonth &&
            paymentDay === selectedDay
          ) {
            duePayments.push({
              debtorName: debtor.full_name,
              amount: debt.month_sum,
            });
          }
          currentPaymentDate.setMonth(currentPaymentDate.getMonth() + 1);
        }
      }
    }
    return {
      status_code: HttpStatus.OK,
      message: 'success',
      data: { totalAmount, duePayments },
    };
  }

  async mainMenuStatistics(id: string) {
    const [debtorsCount, totalDebt] = await Promise.all([
      this.debtorRepository.count({
        where: { store: { id } },
      }),
      this.storeRepository
        .createQueryBuilder('store')
        .leftJoin('store.debtors', 'debtor')
        .leftJoin('debtor.debts', 'debt')
        .where('store.id = :id', { id })
        .select('COALESCE(SUM(debt.debt_sum), 0)', 'total')
        .getRawOne(),
    ]);
    return {
      status_code: HttpStatus.OK,
      message: 'success',
      data: {
        total_debts: Number(totalDebt.total) || 0,
        debtors_count: debtorsCount,
      },
    };
  }

  async latePayments(storeId: string) {
    const store = await this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.debtors', 'debtors')
      .leftJoinAndSelect('debtors.debts', 'debts')
      .leftJoinAndSelect('debts.payments', 'payments')
      .where('store.id = :storeId', { storeId })
      .getOne();
    let totalLateDebts = 0;
    if (store?.debtors) {
      const currentDate = new Date();
      for (const debtor of store.debtors) {
        if (debtor.debts && debtor.debts.length > 0) {
          for (const debt of debtor.debts) {
            const paidAmount =
              debt.payments?.reduce(
                (sum, payment) => sum + Number(payment.sum),
                0,
              ) || 0;
            const remainingDebt = Number(debt.debt_sum) - paidAmount;
            if (remainingDebt > 0) {
              const debtDate = new Date(debt.debt_date);
              const diffTime = currentDate.getTime() - debtDate.getTime();
              const diffMonths = Math.floor(
                diffTime / (1000 * 60 * 60 * 24 * 30),
              );
              if (diffMonths > 0) {
                totalLateDebts += diffMonths;
              }
            }
          }
        }
      }
    }
    return {
      status_code: 200,
      message: 'Success',
      lateDebts: totalLateDebts,
    };
  }
}
