import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { StoreEntity, LikesEntity, DebtorEntity } from '../../core';
import { CustomJwtModule } from '../../infrastructure';

@Module({
  imports: [
    TypeOrmModule.forFeature([DebtorEntity, LikesEntity, StoreEntity]),
    CustomJwtModule,
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
