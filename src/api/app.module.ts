import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { CustomJwtModule } from 'src/infrastructure/lib/custom-jwt/custom-jwt.module';
import { StoreModule } from './store/store.module';
import { DebtModule } from './debt/debt.module';
import { DebtorModule } from './debtors/debtor.module';
import { config } from '../config/index';
import { AuthModule } from './auth/auth.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000 * 60,
        limit: 15,
      },
    ]),
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
    AdminModule,
    CustomJwtModule,
    StoreModule,
    DebtModule,
    DebtorModule,
    AuthModule,
    LikesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
