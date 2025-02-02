import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomJwtModule } from '../../infrastructure';
import { StoreEntity } from '../../core';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreEntity]),
    CustomJwtModule,
    StoreModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
