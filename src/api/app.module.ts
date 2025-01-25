import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { resolve } from 'path';
import { config } from '../config';
import { AdminModule } from './admin/admin.module';
import { StoreModule } from './store/store.module';
import { PaymentModule } from './payment/payment.module';
import { DebtorModule } from './debtors/debtor.module';
import { DebtModule } from './debt/debt.module';
import { AuthModule } from './auth/auth.module';
import { LikesModule } from './likes/likes.module'
import { CustomJwtModule } from '../infrastructure';
import { MessagesModule } from './messages/messages.module';
import { SampleMessageModule } from './sample-message/sample-message.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.DB_URL,
      entities: ['dist/core/entity/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 1000,
      limit: 3,
    }]),
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
    LikesModule,
    MessagesModule,
    SampleMessageModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
