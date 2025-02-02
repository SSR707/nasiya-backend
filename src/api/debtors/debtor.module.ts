import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtorController } from './debtor.controller';
import { DebtorService } from './debtor.service';
import { DebtorPhoneEntity, DebtorEntity, DebtorImageEntity } from '../../core';
import { CustomJwtModule, FileModule } from '../../infrastructure';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DebtorEntity,
      DebtorImageEntity,
      DebtorPhoneEntity,
    ]),
    FileModule,
    CustomJwtModule,
  ],
  controllers: [DebtorController],
  providers: [DebtorService],
  exports: [DebtorService],
})
export class DebtorModule {}
