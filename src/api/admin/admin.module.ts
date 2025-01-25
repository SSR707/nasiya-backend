import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminEntity } from '../../core';
import { CustomJwtModule } from '../../infrastructure';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    CustomJwtModule,
    StoreModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
