import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import {
  ResetPasscodeStoreDto,
  UpdateStoreDto,
  PasscodeStoreDto,
  CreateStoreDto,
} from './dto';
import { BcryptEncryption, BaseService } from '../../infrastructure';
import { StoreRepository, StoreEntity } from '../../core';

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
        ...createStoreDto,
        hashed_password: hashPass,
      });
      const { data } = storeData;
      const { hashed_password, passcode, ...withoutPass } = data;
      return {
        status_code: 201,
        message: 'sucess',
        data: withoutPass,
      };
    }
    throw new HttpException('Store already creaeted before', 400);
  }
  async findAllData() {
    const allStore = await this.findAll({ relations: ['debtors'] });
    const { data } = allStore;
    const updatedData = data.map((item) => {
      const { hashed_password, passcode, ...withoutPass } = item;
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
        created_at: true,
        updated_at: true,
      },
    });
  }
  async getProfile(id: string) {
    return await this.findOneBy({
      where: { id },
      select: {
        image: true,
        fullname: true,
        phone_number: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
  async updateProfile(id: string, updateStoreDto: UpdateStoreDto) {
    const existingEntity = await this.findOneById(id);
    if (!existingEntity) {
      throw new HttpException(`Store with ID ${id} not found`, 404);
    }
    const dto = {
      email: updateStoreDto.email,
      fullname: updateStoreDto.fullname,
      phone_number: updateStoreDto.phone_number,
      image: updateStoreDto.image,
    };
    await this.updateProfile(id, {
      ...dto,
    });
    const updatedEntity = await this.getProfile(id);
    return updatedEntity;
  }
  async addPasscode(store_id: string, addPasscode: PasscodeStoreDto) {
    const hash = await BcryptEncryption.encrypt(addPasscode.passcode);
    const getUser = await this.findOneBy({ where: { id: store_id } });
    const addPassCode = await this.getRepository.update(
      { id: store_id },
      { passcode: hash },
    );
    return {
      status_code: 200,
      message: 'OK',
      data: addPassCode,
    };
  }
  async resetPasscode(
    resetPasscodeStoreDto: ResetPasscodeStoreDto,
    store_id: string,
  ) {
    const getStore = await this.getRepository.findOne({
      where: {
        id: store_id,
      },
    });
    if (!getStore) {
      throw new HttpException('Not found', 404);
    }
    const isChecked = await BcryptEncryption.compare(
      resetPasscodeStoreDto.oldPasscode,
      resetPasscodeStoreDto.passcode,
    );
    if (!isChecked) {
      throw new HttpException('Your entered wrong password', 400);
    } else {
      await this.getRepository.update(
        { id: store_id },
        {
          passcode: BcryptEncryption.encrypt(resetPasscodeStoreDto.passcode),
        },
      );
      return {
        status_code: HttpStatus.OK,
        message: 'Passcode updated',
      };
    }
  }
  async remove(id: string) {
    return await this.delete(id);
  }
}
