import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminEntity } from 'src/core/entity/admin.entity';
import { DeepPartial } from 'typeorm';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { BcryptEncryption } from 'src/infrastructure/lib/bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRepository } from 'src/core/repository/admin.repository';
import { CustomJwtService } from 'src/infrastructure/lib/custom-jwt/custom-jwt.service';
import { ConfigService } from '@nestjs/config';
import { CreateStoreDto } from '../store/dto/create-store.dto';
import { StoreService } from '../store/store.service';
// import { CreateStoreDto } from './dto/create-store.dto';
@Injectable()
export class AdminService extends BaseService<
  CreateAdminDto,
  DeepPartial<AdminEntity>
> {
  constructor(
    @InjectRepository(AdminEntity) repository: AdminRepository,
    private readonly storeService: StoreService,
  ) {
    super(repository);
  }
  async createAdmin(createAdminDto: CreateAdminDto) {
    const { username, hashed_password, phone_number } = createAdminDto;
    const exist_username = await this.getRepository.findOne({
      where: { username },
    });
    if (exist_username) {
      throw new ConflictException(`Username already exist`);
    }
    if (phone_number) {
      const exist_phone = await this.getRepository.findOne({
        where: { phone_number },
      });
      if (exist_phone) {
        throw new ConflictException(`Phone number already exist`);
      }
    }
    const password = await BcryptEncryption.encrypt(hashed_password);
    try {
      const Admin = await this.getRepository.create({
        ...createAdminDto,
        hashed_password: password,
      });
      await this.getRepository.save(Admin);
    } catch (error) {
      throw new BadRequestException(`Error on creating super admin: ${error}`);
    }
    return { status_code: HttpStatus.CREATED, message: 'success' };
  }

  async createStore(createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  async getAllAdmin() {
    return this.findAll();
  }

  async getAdminById(id: string) {
    try {
      const Admin = await this.getRepository.findOne({ where: { id } });
      if (!Admin) {
        throw new NotFoundException(`Admin with id ${id} not found.`);
      }
      return {
        status_code: 200,
        message: 'success',
        data: { Admin },
      };
    } catch (error) {
      throw new BadRequestException(`Error on delete  of admin: ${error}`);
    }
  }
  async editProfile(id: string, updateAdminDto: UpdateAdminDto) {
    let { username, phone_number, hashed_password } = updateAdminDto;
    const admin = await this.getRepository.findOne({
      where: { id },
    });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    if (hashed_password) {
      hashed_password = await BcryptEncryption.encrypt(hashed_password);
    } else {
      hashed_password = admin.hashed_password;
    }
    if (!username) {
      username = admin.username;
    }

    if (!phone_number) {
      phone_number = admin.phone_number;
    }
    try {
      await this.getRepository.update(id, {
        username,
        hashed_password,
        phone_number,
        updated_at: Date.now(),
      });
    } catch (error) {
      throw new BadRequestException(
        `Error on update profile of admin: ${error}`,
      );
    }
    return {
      status_code: 200,
      message: 'success',
    };
  }
  async deleteAdmin(id: string) {
    try {
      await this.findOneById(id);
      await this.delete(id);
    } catch (error) {
      throw new BadRequestException(`Error on delete  of admin: ${error}`);
    }
    return {
      status_code: 200,
      message: 'success',
    };
  }
}
