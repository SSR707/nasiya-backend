import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomJwtModule } from 'src/infrastructure/lib/custom-jwt/custom-jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from 'src/core/entity/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity]), CustomJwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
