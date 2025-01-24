import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtorController } from './debtor.controller';
import { DebtorService } from './debtor.service';
import { DebtorEntity } from '../../core/entity/debtor.entity';
import { FileModule } from '../../infrastructure/lib/file/file.module';
import { DebtorImageEntity } from '../../core/entity/debtor-image.entity';
import { DebtorPhoneEntity } from '../../core/entity/debtor-phone.entity';
import { CustomJwtModule } from '../../infrastructure/lib/custom-jwt/custom-jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DebtorEntity, DebtorImageEntity, DebtorPhoneEntity]),
    FileModule,
    CustomJwtModule,
  ],
  controllers: [DebtorController],
  providers: [DebtorService],
  exports: [DebtorService],
})
export class DebtorModule {}
