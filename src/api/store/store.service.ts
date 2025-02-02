import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import {
  ResetPasscodeStoreDto,
  UpdateStoreDto,
  PasscodeStoreDto,
  CreateStoreDto,
} from './dto';
import {
  BcryptEncryption,
  BaseService,
  FileService,
} from '../../infrastructure';
import { StoreRepository, StoreEntity } from '../../core';

@Injectable()
export class StoreService extends BaseService<
  CreateStoreDto,
  DeepPartial<StoreEntity>
> {
  constructor(
    @InjectRepository(StoreEntity) repository: StoreRepository,
    private readonly fileService: FileService,
  ) {
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
    };
    await this.getRepository.update(id, {
      ...dto,
    });
    const updatedEntity = await this.getProfile(id);
    return updatedEntity;
  }
  async uploadProfileImage(id: string, image: Express.Multer.File) {
    const storeData = await this.getRepository.findOne({
      where: { id },
    });
    if (!storeData) {
      throw new HttpException('Store not found!', 404);
    }
    if (storeData.image) {
      await this.fileService.deleteFile(storeData.image);
    }
    const fileUrl = await this.fileService.uploadFile(image, 'profileImage');
    await this.getRepository.update(id, { image: fileUrl.path });
    const updatedStoreData = await this.getProfile(id);
    return updatedStoreData;
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
      data: 'Passcode created successfully',
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
      getStore.passcode,
    );
    if (!isChecked) {
      throw new HttpException('Your entered wrong password', 400);
    } else {
      await this.getRepository.update(
        { id: store_id },
        {
          passcode: await BcryptEncryption.encrypt(
            resetPasscodeStoreDto.passcode,
          ),
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
