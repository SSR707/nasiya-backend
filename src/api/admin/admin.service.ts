import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { SigninDto } from './dto/signin-admin.dto';
import { AdminEntity } from 'src/core/entity/admin.entity';
import { DeepPartial } from 'typeorm';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { BcryptEncryption } from 'src/infrastructure/lib/bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRepository } from 'src/core/repository/admin.repository';
import { CustomJwtService } from 'src/infrastructure/lib/custom-jwt/custom-jwt.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
@Injectable()
export class AdminService extends BaseService<
  CreateAdminDto,
  DeepPartial<AdminEntity>
> {
  constructor(
    @InjectRepository(AdminEntity) repository: AdminRepository,
    private jwt: CustomJwtService,
    private readonly configService: ConfigService,
  ) {
    super(repository);
  }
  async createSuperAdmin(createAdminDto: CreateAdminDto) {
    const { username, hashed_password, phone_number, email } = createAdminDto;
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
    if (email) {
      const exist_email = await this.getRepository.findOne({
        where: { email },
      });
      if (exist_email) {
        throw new ConflictException(`Email address already exist`);
      }
    }
    const password = await BcryptEncryption.encrypt(hashed_password);
    try {
      const superAdmin = await this.getRepository.create({
        ...createAdminDto,
        hashed_password: password,
      });
      await this.getRepository.save(superAdmin);
    } catch (error) {
      throw new BadRequestException(`Error on creating super admin: ${error}`);
    }
    return { status_code: HttpStatus.CREATED, message: 'success' };
  }

  async signin(signinDto: SigninDto, res: Response) {
    const { username, password } = signinDto;
    const user = await this.getRepository.findOne({ where: { username } });
    if (!user) {
      throw new BadRequestException('Username or password invalid');
    }
    const is_match_pass = await BcryptEncryption.compare(
      password,
      user.hashed_password,
    );
    if (!is_match_pass) {
      throw new BadRequestException('Username or password invalid');
    }
    const accessToken = await this.jwt.generateAccessToken(user);
    const refreshToken = await this.jwt.generateRefreshToken(user);
    await this.getRepository.update(user.id, { refresh_token: refreshToken });
    this.writeToCookie(refreshToken, res);
    return {
      status_code: HttpStatus.OK,
      message: 'success',
      data: {
        accessToken,
        access_token_expire: this.configService.get<string>(
          'JWT_ACCESS_EXPIRES_IN',
        ),
        refreshToken,
        refresh_token_expire: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
        ),
      },
    };
  }

  async refresh_token(refresh_token: string) {
    const data = await this.jwt.verifyRefreshToken(refresh_token);
    const user = await this.findOneById(data?.id);
    const accessToken = await this.jwt.generateAccessToken(user.data);
    return {
      status_code: HttpStatus.OK,
      message: 'success',
      data: {
        token: accessToken,
        expire: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
      },
    };
  }

  async logout(refresh_token: string, res: Response) {
    const data = await this.jwt.verifyRefreshToken(refresh_token);
    await this.findOneById(data?.id);
    res.clearCookie('refresh_token_admin');
    return {
      status_code: HttpStatus.OK,
      message: 'success',
    };
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
    let { fullname, username, phone_number, email, hashed_password } =
      updateAdminDto;
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
    if (!fullname) {
      fullname = admin.fullname;
    }
    if (!phone_number) {
      phone_number = admin.phone_number;
    }
    if (!email) {
      email = admin.email;
    }
    try {
      await this.getRepository.update(id, {
        fullname,
        username,
        hashed_password,
        phone_number,
        email,
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

  private async writeToCookie(refresh_token: string, res: Response) {
    try {
      res.cookie('refresh_token_admin', refresh_token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    } catch (error) {
      throw new BadRequestException(`Error on write to cookie: ${error}`);
    }
  }
}
