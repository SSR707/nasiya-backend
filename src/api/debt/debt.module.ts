import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtService } from './debt.service';
import { DebtController } from './debt.controller';
import { DebtEntity } from '../../core';
import { CustomJwtModule } from '../../infrastructure';

@Module({
  imports: [TypeOrmModule.forFeature([DebtEntity]), CustomJwtModule],
  controllers: [DebtController],
  providers: [DebtService],
})
export class DebtModule {}
