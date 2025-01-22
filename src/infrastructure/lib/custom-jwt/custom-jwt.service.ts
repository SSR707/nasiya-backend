import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async generateRefreshToken(user: any): Promise<string> {
    const payload = { sub: user.username, role: user.role, id: user.id };

    try {
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      });
      return refreshToken;
    } catch (error) {
      throw new BadRequestException('Failed to generate refresh token.');
    }
  }

  async generateAccessToken(user: any): Promise<string> {
    const payload = { sub: user.username, role: user.role, id: user.id };

    try {
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
      });
      return accessToken;
    } catch (error) {
      throw new BadRequestException('Failed to generate access token.');
    }
  }

  async verifyRefreshToken(refresh_token: any){
    try {
      const data = await this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      return data
    } catch (error) {
      throw new BadRequestException(`Error on refresh token: ${error}`);
    }
  }

  async verifyAccessToken(access_token: any){
    try {
      const data = await this.jwtService.verify(access_token, {
        secret:this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      return data
    } catch (error) {
      throw new BadRequestException(`Error on refresh token: ${error}`);
    }
  }
}
