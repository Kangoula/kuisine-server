import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EntityNotFoundErrorFilter } from './common/filters/entity-not-found-error.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { CookieTypeNames } from './auth/auth.service';
import { CommandFactory } from 'nest-commander';

const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Kuisine')
    .setDescription('Public API')
    .setVersion('1.0')
    .addCookieAuth(CookieTypeNames.Access)
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true, // Keep auth token after reload
      withCredentials: true, // Ensures cookies are sent with request
    },
  });
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('query parser', 'extended');

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  app.useGlobalFilters(new EntityNotFoundErrorFilter());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  if (process.env.NODE_ENV === 'development') {
    setupSwagger(app);
  }

  await app.listen(process.env.PORT ?? 3000);

  await CommandFactory.run(AppModule);
}
bootstrap();
