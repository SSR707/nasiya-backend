import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateLikeDto } from './dto';
import { BaseService } from '../../infrastructure';
import {
  StoreEntity,
  DebtorEntity,
  LikesRepository,
  LikesEntity,
} from '../../core';

@Injectable()
export class LikesService extends BaseService<
  CreateLikeDto,
  DeepPartial<LikesEntity>
> {
  constructor(
    @InjectRepository(LikesEntity) repository: LikesRepository,
    @InjectRepository(DebtorEntity)
    private debtorRepository: Repository<DebtorEntity>,
    @InjectRepository(StoreEntity)
    private storeRepository: Repository<StoreEntity>,
  ) {
    super(repository);
  }

  async createLikes(createLikeDto: CreateLikeDto) {
    const { store_id, debtor_id } = createLikeDto;
    const store = await this.storeRepository.findOne({
      where: { id: store_id },
    });
    const debtor = await this.debtorRepository.findOne({
      where: { id: debtor_id },
    });
    if (!store) {
      throw new NotFoundException(`Store with id ${store_id} not found.`);
    }
    if (!debtor) {
      throw new NotFoundException(`Debtor with id ${debtor_id} not found.`);
    }
    const like = await this.getRepository.create({ store, debtor });
    await this.getRepository.save(like);
  }

  async handleLikeOrUnlike(storeId: string, debtorId: string) {
    const IsChek = await this.getRepository.findOne({
      where: { debtor_id: debtorId },
    });
    if (IsChek) {
      await this.delete(IsChek.id);
      return { status_code: HttpStatus.OK, message: 'success', data: 'UNLIKE' };
    } else {
      await this.createLikes({ store_id: storeId, debtor_id: debtorId });
      return { status_code: HttpStatus.OK, message: 'success', data: 'LIKE' };
    }
  }

  async findAllLikes(id: string) {
    const likes = await this.getRepository.find({
      where: { store_id: id },
      relations: ['debtor', 'store'],
      select: {
        store: {
          id: true,
          created_at: true,
          updated_at: true,
          fullname: true,
          login: true,
          wallet: true,
          image: true,
          email: true,
          phone_number: true,
        },
      },
    });
    return { status_code: HttpStatus.OK, message: 'success', data: likes };
  }

  async findOneLikes(id: string) {
    return this.findOneById(id, {
      relations: ['debtor', 'store'],
      select: {
        store: {
          id: true,
          created_at: true,
          updated_at: true,
          fullname: true,
          login: true,
          wallet: true,
          image: true,
          email: true,
          phone_number: true,
        },
      },
    });
  }
}
