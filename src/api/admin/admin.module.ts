import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminEntity } from 'src/core/entity/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomJwtModule } from 'src/infrastructure/lib/custom-jwt/custom-jwt.module';

@Module({
  imports:[TypeOrmModule.forFeature([AdminEntity]) ,CustomJwtModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
