import { HttpException, Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { StoreEntity } from 'src/core/entity/store.entity';
import { DeepPartial } from 'typeorm';
import { StoreRepository } from 'src/core/repository/store.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordStoreDto } from './dto/reset-password.dto';
import { BcryptEncryption } from 'src/infrastructure/lib/bcrypt';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class StoreService extends BaseService<
  CreateStoreDto,
  DeepPartial<StoreEntity>
> {
  constructor(@InjectRepository(StoreEntity) repository: StoreRepository) {
    super(repository);
  }
  async storeCreate(createStoreDto: CreateStoreDto) {
    const getUser = await this.getRepository.findOne({
      where: { login: createStoreDto.login },
    });
    const hashPass = await BcryptEncryption.encrypt(
      createStoreDto.hashed_password,
    );
    if (!getUser) {
      const storeData = await this.create({
        hashed_password: hashPass,
        ...createStoreDto,
      });
      const { data } = storeData;
      const { hashed_password, ...withoutPass } = data;
      return {
        status_code: 201,
        message: 'sucess',
        data: withoutPass,
      };
    }
    throw new HttpException('Store already creaeted before', 400);
  }
  async findAllPagination() {
    const allStore = await this.findAllWithPagination();
    const { data } = allStore;
    const updatedData = data.map((item) => {
      const { hashed_password, ...withoutPass } = item;
      return withoutPass;
    });
    return {
      status_code: 200,
      message: 'OK',
      data: updatedData,
    };
  }

  async findOne(id: string) {
    return await this.findOneBy({
      where: { id },
      relations: ['debtors'],
      select: {
        login: true,
        image: true,
        wallet: true,
        is_active: true,
      },
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
    return updatedEntity;
  }
  async resetPassword(
    resetPasswordStoreDto: ResetPasswordStoreDto,
    store_id: string,
  ) {
    const getStore = await this.getRepository.findOne({
      where: {
        id: store_id,
      },
    });

    if (resetPasswordStoreDto.oldPassword !== getStore.hashed_password) {
      throw new HttpException('Your entered wrong password', 400);
    } else {
      await this.getRepository.update(
        { id: store_id },
        {
          hashed_passowrd: BcryptEncryption.encrypt(
            resetPasswordStoreDto.hashed_password,
          ),
        },
      );
    }
  }

  remove(id: string) {
    return this.getRepository.delete(id);
  }
}
