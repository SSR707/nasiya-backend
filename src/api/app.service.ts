import { NestFactory } from '@nestjs/core';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { config } from '../config';
import { AllExceptionsFilter } from '../infrastructure';
import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';

export default class Application {
  public static async main(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new AllExceptionsFilter());
    app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      }),
    );

    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' }, 
      }),
    );
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );
    app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
    app.use(
      '/uploads/debtors',
      express.static(path.join(process.cwd(), 'uploads', 'debtors')),
    );
    app.use(
      '/uploads/debt',
      express.static(path.join(process.cwd(), 'uploads', 'debt')),
    );
    const api = 'api/v1';
    const swaggerApi = 'api/docs';
    app.setGlobalPrefix(api);

    const config_swagger = new DocumentBuilder()
      .setTitle('Nasiya Savdo')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'Bearer',
        in: 'Header',
      })
      .build();

    const documentFactory = () =>
      SwaggerModule.createDocument(app, config_swagger);

    SwaggerModule.setup(swaggerApi, app, documentFactory);

    await app.listen(config.API_PORT, () => {
      console.log(Date.now());
    });
  }
}
