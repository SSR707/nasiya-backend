import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debtor } from 'src/core/entity/debtor.entity';
import { LikesEntity } from 'src/core/entity/like.entity';
import { StoreEntity } from 'src/core/entity/store.entity';
import { CustomJwtModule } from 'src/infrastructure/lib/custom-jwt/custom-jwt.module';

@Module({
  imports:[TypeOrmModule.forFeature([Debtor , LikesEntity , StoreEntity]) ,CustomJwtModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
