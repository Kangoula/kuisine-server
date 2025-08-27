import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EntityNotFoundErrorFilter } from './common/filters/entity-not-found-error.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('query parser', 'extended');

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  app.useGlobalFilters(new EntityNotFoundErrorFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
