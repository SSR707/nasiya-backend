import { NestFactory } from '@nestjs/core';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { config } from '../config';
import { AllExceptionsFilter } from '../infrastructure';

export default class Application {
  public static async main(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    // app.useGlobalFilters(new AllExceptionsFilter());
    app.enableCors({
      origin: '*',
    });
    app.use(helmet());
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );

    const api = 'api/v1';
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

    SwaggerModule.setup(api, app, documentFactory);


    await app.listen(config.API_PORT, () => {
      console.log(Date.now());
    });
  }
}
