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

    // console.log(dateForStatistics, {
    //   date_month: dateForStatistics.getMonth() + 1,
    //   date_date: dateForStatistics.getDate(),
    // });

    // filter data
    const result = [];

    for (const data of allDebtorsData) {
      const payment_date = data.debtor_payment_date[0];

      const year = dateForStatistics.getFullYear() - payment_date.getFullYear();
      if (-1 <= year && year <= 1) {
        let month =
          dateForStatistics.getMonth() + 1 - (payment_date.getMonth() + 1);

        // console.log({
        //   date: dateForStatistics.getMonth() + 1,
        //   debtor_payment_date: payment_date.getMonth() + 1,
        //   month: month,
        // });
        if (0 <= month && month <= 12 && data.debt_period[0] >= month) {
          const day = dateForStatistics.getDate() - payment_date.getDate();

          // console.log({
          //   date: dateForStatistics.getDate(),
          //   debtor_payment_date: payment_date.getDate(),
          //   day: day,
          // });
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

  async getMonthlyStoreStatistics(
    storeId: string,
    year: number,
    month: number,
  ) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    // Get monthly debts
    const monthlyDebts = await this.debtRepository
      .createQueryBuilder('debt')
      .innerJoinAndSelect('debt.debtor', 'debtor')
      .where('debtor.store_id = :storeId', { storeId })
      .andWhere('debt.debt_date BETWEEN :startOfMonth AND :endOfMonth', {
        startOfMonth,
        endOfMonth,
      })
      .getMany();

    // Get monthly payments
    const monthlyPayments = await this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoin('payment.debt', 'debt')
      .leftJoin('debt.debtor', 'debtor')
      .where('debtor.store_id = :storeId', { storeId })
      .andWhere('payment.date BETWEEN :startOfMonth AND :endOfMonth', {
        startOfMonth,
        endOfMonth,
      })
      .getMany();

    // Get daily breakdown
    const dailyStats = {};
    monthlyDebts.forEach((debt) => {
      const day = debt.debt_date.getDate();
      if (!dailyStats[day]) {
        dailyStats[day] = {
          debts: 0,
          payments: 0,
        };
      }
      dailyStats[day].debts += Number(debt.debt_sum);
    });

    monthlyPayments.forEach((payment) => {
      const day = payment.date.getDate();
      if (!dailyStats[day]) {
        dailyStats[day] = {
          debts: 0,
          payments: 0,
        };
      }
      dailyStats[day].payments += Number(payment.sum);
    });

    const totalMonthlyDebt = monthlyDebts.reduce(
      (sum, debt) => sum + Number(debt.debt_sum),
      0,
    );
    const totalMonthlyPayments = monthlyPayments.reduce(
      (sum, payment) => sum + Number(payment.sum),
      0,
    );

    return {
      year,
      month,
      total_new_debts: monthlyDebts.length,
      total_debt_amount: totalMonthlyDebt,
      total_payments: monthlyPayments.length,
      total_payment_amount: totalMonthlyPayments,
      net_monthly_balance: totalMonthlyPayments - totalMonthlyDebt,
      daily_breakdown: dailyStats,
    };
  }

  async getDebtorStatistics(storeId: string) {
    // Get all debtors
    const debtors = await this.debtorRepository.find({
      where: { store_id: storeId },
      relations: ['debts', 'debts.payments'],
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let totalActiveDebtors = 0;
    let totalOverdueDebtors = 0;
    let totalDebt = 0;
    let totalPaid = 0;

    const debtorStats = debtors.map((debtor) => {
      const debtorTotalDebt = debtor.debts.reduce(
        (sum, debt) => sum + Number(debt.debt_sum),
        0,
      );
      const debtorTotalPaid = debtor.debts.reduce(
        (sum, debt) =>
          sum +
          debt.payments.reduce(
            (pSum, payment) => pSum + Number(payment.sum),
            0,
          ),
        0,
      );

      const hasOverdueDebt = debtor.debts.some(
        (debt) =>
          debt.debt_date < today &&
          debt.debt_sum >
            debt.payments.reduce(
              (sum, payment) => sum + Number(payment.sum),
              0,
            ),
      );

      const isActive = debtorTotalDebt > debtorTotalPaid;

      if (isActive) totalActiveDebtors++;
      if (hasOverdueDebt) totalOverdueDebtors++;
      totalDebt += debtorTotalDebt;
      totalPaid += debtorTotalPaid;

      return {
        debtor_id: debtor.id,
        full_name: debtor.full_name,
        phone_number: debtor.phone_number,
        total_debt: debtorTotalDebt,
        total_paid: debtorTotalPaid,
        remaining_debt: debtorTotalDebt - debtorTotalPaid,
        has_overdue: hasOverdueDebt,
        is_active: isActive,
      };
    });

    return {
      total_debtors: debtors.length,
      active_debtors: totalActiveDebtors,
      overdue_debtors: totalOverdueDebtors,
      total_debt_amount: totalDebt,
      total_paid_amount: totalPaid,
      remaining_debt: totalDebt - totalPaid,
      debtor_details: debtorStats,
    };
  }

  async updateStoreStatistics(storeId: string) {
    const stats = await this.getDebtorStatistics(storeId);

    await this.storeRepository.update(storeId, {
      wallet: stats.total_debt_amount,
    });
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
