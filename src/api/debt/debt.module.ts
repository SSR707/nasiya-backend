import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtService } from './debt.service';
import { DebtController } from './debt.controller';
import { DebtEntity, DebtorEntity } from '../../core';
import { CustomJwtModule } from '../../infrastructure';
import { DebtImageEntity } from 'src/core/entity/debt-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DebtEntity, DebtImageEntity, DebtorEntity]),
    CustomJwtModule,
  ],
  controllers: [DebtController],
  providers: [DebtService],
  exports: [DebtService],
})
export class DebtModule {}
