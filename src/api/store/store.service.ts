import { HttpException, Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { StoreEntity } from 'src/core/entity/store.entity';
import { DeepPartial } from 'typeorm';
import { StoreRepository } from 'src/core/repository/store.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StoreService extends BaseService<
  CreateStoreDto,
  DeepPartial<StoreEntity>
> {
  constructor(@InjectRepository(StoreEntity) repository: StoreRepository) {
    super(repository);
  }
  create(createStoreDto: CreateStoreDto) {
    return this.getRepository.create({ createStoreDto });
  }

  async findAll() {
    // const options = {
    //   relations: ['debtors'],
    // };
    return await this.findAll();
  }

  async findOne(id: string) {
    return await this.findOneBy({
      where: { id },
      relations: ['debtors'],
    });
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    const existingEntity = await this.findOneById(id);
    if (!existingEntity) {
      throw new HttpException(`Store with ID ${id} not found`, 404);
    }
    await this.getRepository.update(
      { id },
      { ...updateStoreDto, updated_at: new Date() },
    );
    const updatedEntity = await this.findOneById(id);
    return {
      status_code: 200,
      message: 'success',
      data: updatedEntity.data,
    };
  }

  remove(id: string) {
    return this.getRepository.delete(id);
  }
}
