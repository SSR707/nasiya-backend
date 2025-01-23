import { Module } from '@nestjs/common';
import { DebtService } from './debt.service';
import { DebtController } from './debt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtEntity } from 'src/core/entity/debt.entity';
import { CustomJwtModule } from 'src/infrastructure/lib/custom-jwt/custom-jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([DebtEntity]), CustomJwtModule],
  controllers: [DebtController],
  providers: [DebtService],
})
export class DebtModule {}
