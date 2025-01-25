import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { DeepPartial } from 'typeorm';
import { StoreRepository, StoreEntity } from '../../core';
import {
  BcryptEncryption,
  CustomJwtService,
  BaseService,
} from '../../infrastructure';
import { SigninStoreDto } from './dto';
import { CreateStoreDto } from '../store/dto';

@Injectable()
export class AuthService extends BaseService<
  CreateStoreDto,
  DeepPartial<StoreEntity>
> {
  constructor(
    @InjectRepository(StoreEntity) repository: StoreRepository,
    private jwt: CustomJwtService,
    private readonly configService: ConfigService,
  ) {
    super(repository);
  }

  async signin(signinDto: SigninStoreDto, res: Response) {
    const { login, password } = signinDto;
    const user = await this.getRepository.findOne({ where: { login } });
    if (!user) {
      throw new BadRequestException('login  or password invalid');
    }
    const is_match_pass = await BcryptEncryption.compare(
      password,
      user.hashed_password,
    );
    if (!is_match_pass) {
      throw new BadRequestException('Username or password invalid');
    }
    const payload = { sub: user.login, id: user.id };
    const accessToken = await this.jwt.generateAccessToken(payload);
    const refreshToken = await this.jwt.generateRefreshToken(payload);
    this.writeToCookie(refreshToken, res);
    return {
      status_code: HttpStatus.OK,
      message: 'success',
      data: {
        accessToken,
        access_token_expire:
          this.configService.get<string>('REFRESH_TOKEN_KEY'),
        refreshToken,
        refresh_token_expire:
          this.configService.get<string>('REFRESH_TOKEN_TIME'),
      },
    };
  }

  async refresh_token(refresh_token: string) {
    const data = await this.jwt.verifyRefreshToken(refresh_token);
    const user = await this.findOneById(data?.id);
    const payload = { sub: user.data.login, id: user.data.id };
    const accessToken = await this.jwt.generateAccessToken(payload);
    return {
      status_code: HttpStatus.OK,
      message: 'success',
      data: {
        token: accessToken,
        expire: this.configService.get<string>('ACCESS_TOKEN_TIME'),
      },
    };
  }

  async logout(refresh_token: string, res: Response) {
    const data = await this.jwt.verifyRefreshToken(refresh_token);
    await this.findOneById(data?.id);
    res.clearCookie('refresh_token_store');
    return {
      status_code: HttpStatus.OK,
      message: 'success',
    };
  }
  private async writeToCookie(refresh_token: string, res: Response) {
    try {
      res.cookie('refresh_token_store', refresh_token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    } catch (error) {
      throw new BadRequestException(`Error on write to cookie: ${error}`);
    }
  }
}
