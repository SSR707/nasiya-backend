import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DebtEntity } from '../../core/entity/debt.entity';
import { PaymentEntity } from 'src/core';
import { DebtorEntity } from '../../core/entity/debtor.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(DebtEntity)
    private readonly deptRepository: Repository<DebtEntity>,
    private readonly deptorRepository: Repository<DebtorEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {
    // super(repository)
  }

  async calculateTotalDept(): Promise<number> {
    const depts = await this.deptRepository.find();
    const totalDept = depts.reduce(
      (sum, dept) => sum + Number(dept.debt_sum),
      0,
    );
    return totalDept;
  }

  async getActiveDeptors(): Promise<DebtorEntity[]> {
    return await this.deptorRepository.find({
      where: { is_active: true },
      select: [
        'id',
        'full_name',
        'phone_number',
        'image',
        'address',
        'note',
        'is_active',
      ],
    });
  }

  async calculateDailyDept(): Promise<number> {
    const dailyDebt = await this.paymentRepository.find();
    const totalDailyDebt = dailyDebt.reduce(
      (sum, payment) => sum + Number(payment.sum),
      0,
    );
    return totalDailyDebt;
  }

  async calculateMonthlyDept(): Promise<number> {
    return;
  }
}
