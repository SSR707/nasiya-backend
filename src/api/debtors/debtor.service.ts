import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debtor } from '../../core/entity/debtor.entity';
import { CreateDebtorDto, UpdateDebtorDto } from './dto';
import { BaseService } from 'src/infrastructure/lib/baseService';

@Injectable()
export class DebtorService extends BaseService<CreateDebtorDto, Debtor> {
  constructor(
    @InjectRepository(Debtor)
    private readonly debtorRepository: Repository<Debtor>,
  ) {
    super(debtorRepository);
  }

  async findOne(id: string): Promise<Debtor> {
    const debtor = await this.debtorRepository.findOne({ 
      where: { id, is_deleted: false },
      relations: ['messages', 'likes']
    });
    
    if (!debtor) {
      throw new NotFoundException(`Debtor with ID ${id} not found`);
    }
    
    return debtor;
  }

  // async create(createDebtorDto: CreateDebtorDto): Promise<Debtor> {
  //   const debtor = this.debtorRepository.create(createDebtorDto);
  //   return await this.debtorRepository.save(debtor);
  // }

  // async update(id: string, updateDebtorDto: UpdateDebtorDto): Promise<Debtor> {
  //   const debtor = await this.findOne(id);
  //   Object.assign(debtor, updateDebtorDto);
  //   return await this.debtorRepository.save(debtor);
  // }

  async remove(id: string): Promise<void> {
    const debtor = await this.findOne(id);
    debtor.is_deleted = true;
    await this.debtorRepository.save(debtor);
  }

  async findAllActive() {
    return this.findAll({ where: { is_deleted: false } });
  }

  async softDelete(id: string): Promise<void> {
    const debtor = await this.findOne(id);
    debtor.is_deleted = true;
    await this.debtorRepository.save(debtor);
  }
}
