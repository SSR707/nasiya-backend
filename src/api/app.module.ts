import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { CustomJwtModule } from 'src/infrastructure/lib/custom-jwt/custom-jwt.module';
import { PaymentModule } from './payment/payment.module';
import { StoreModule } from './store/store.module';
import { DebtModule } from './debt/debt.module';
import { DebtorModule } from './debtors/debtor.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.DB_URL,
      entities: ['dist/core/entity/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', '..', '..', 'base'),
      serveRoot: '/base',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AdminModule,
    CustomJwtModule,
    PaymentModule,
    StoreModule,
    DebtModule,
    DebtorModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
