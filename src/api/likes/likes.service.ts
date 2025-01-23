import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { LikesEntity } from 'src/core/entity/like.entity';
import { DeepPartial, Repository } from 'typeorm';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { InjectRepository } from '@nestjs/typeorm';
import { LikesRepository } from 'src/core/repository/likes.repository';
import { Debtor } from 'src/core/entity/debtor.entity';
import { StoreEntity } from 'src/core/entity/store.entity';

@Injectable()
export class LikesService extends BaseService<
  CreateLikeDto,
  DeepPartial<LikesEntity>
> {
  constructor(
    @InjectRepository(LikesEntity) repository: LikesRepository,
    @InjectRepository(Debtor)
    private debtorRepository: Repository<Debtor>,
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
    return { status_code: HttpStatus.CREATED, message: 'success', data: like };
  }

  findAllLikes() {
    return this.getRepository.find({ relations: ['debtor', 'store'] });
  }

  async findOneLikes(id: string) {
    return this.findOneById(id, {
      relations: ['debtor', 'store'],
    });
  }

  updateLikes(id: string, updateLikeDto: UpdateLikeDto) {
    return `This action updates a #${id} like`;
  }

  async removeLIkes(id: string) {
    const like = await this.getRepository.findOne({ where: { id } });
    if (!like) {
      throw new NotFoundException(`Like with id ${id} not found.`);
    }
    return this.delete(id);
  }
}
