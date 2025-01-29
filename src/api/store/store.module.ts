import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { StoreEntity, DebtEntity, PaymentEntity, DebtorEntity } from '../../core';
import { CustomJwtModule, FileModule } from 'src/infrastructure';
import { StoreStatisticsController } from './store-statistics.controller';
import { StoreStatisticsService } from './store-statistics.service';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreEntity, DebtEntity, PaymentEntity, DebtorEntity]),
    CustomJwtModule,
    FileModule,
  ],
  controllers: [StoreController, StoreStatisticsController],
  providers: [StoreService, StoreStatisticsService, Reflector],
  exports: [StoreService],
})
export class StoreModule {}
