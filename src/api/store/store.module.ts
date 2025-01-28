import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { StoreEntity } from '../../core';
import { CustomJwtModule, FileModule } from 'src/infrastructure';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreEntity]),
    CustomJwtModule,
    FileModule,
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
