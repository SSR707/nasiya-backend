import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomJwtModule } from '../../infrastructure';
import { StoreEntity } from '../../core';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity]), CustomJwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
