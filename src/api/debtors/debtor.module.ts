import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtorService } from './debtor.service';
import { DebtorController } from './debtor.controller';
import { Debtor } from '../../core/entity/debtor.entity';
import { CustomJwtModule } from 'src/infrastructure/lib/custom-jwt/custom-jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Debtor]),
    CustomJwtModule
  ],
  controllers: [DebtorController],
  providers: [DebtorService],
  exports: [DebtorService],
})
export class DebtorModule {}
