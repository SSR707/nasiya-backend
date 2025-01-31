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

  async getDailyStoreStatistics(storeId: string, dateForStatistics: Date) {
    // Find store by id and retrieve all data depends
    const allStoreData = await this.storeRepository.findOne({
      where: { id: storeId },
      relations: ['debtors', 'debtors.debts', 'debtors.debts.payments'],
    });
    if (!allStoreData) {
      throw new NotFoundException('Store not found!');
    }
    // search dependency variables
    const data = allStoreData?.debtors;
    const allDebtorsData = data.map((debtor) => ({
      debtor_name: debtor.full_name,
      debt_period: debtor.debts.map((debt) => {
        return debt.debt_period;
      }),
      debtor_payment: debtor.debts.map((debt) => {
        if (debt.payments.length > 0) {
          const [{ sum }] = debt.payments;
          return sum;
        }
        return null;
      }),
      debtor_payment_date: debtor.debts.map((debt) => {
        if (debt.payments.length > 0) {
          const [{ date }] = debt.payments;
          return date;
        }
        return null;
      }),
    }));
    const result = [];
    for (const data of allDebtorsData) {
      const payment_date = data.debtor_payment_date[0];
      const year = dateForStatistics.getFullYear() - payment_date.getFullYear();
      if (-1 <= year && year <= 1) {
        let month =
          dateForStatistics.getMonth() + 1 - (payment_date.getMonth() + 1);
        if (0 <= month && month <= 12 && data.debt_period[0] >= month) {
          const day = dateForStatistics.getDate() - payment_date.getDate();
          if (-3 <= day && day <= 0) {
            if (month == 0 && day < 0) {
              continue;
            }
            result.push(data);
          }
        }
      }
    }
    return { status_code: HttpStatus.OK, result };
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
            // Calculate remaining debt amount after payments
            const paidAmount =
              debt.payments?.reduce(
                (sum, payment) => sum + Number(payment.sum),
                0,
              ) || 0;
            const remainingDebt = Number(debt.debt_sum) - paidAmount;

            // Only count if there is remaining debt
            if (remainingDebt > 0) {
              const debtDate = new Date(debt.debt_date);
              const diffTime = currentDate.getTime() - debtDate.getTime();
              const diffMonths = Math.floor(
                diffTime / (1000 * 60 * 60 * 24 * 30),
              );

              // Only count if debt is late (more than 1 month old)
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
