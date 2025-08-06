import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EntityNotFoundErrorFilter } from './exceptions/filters/entity-not-found-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new EntityNotFoundErrorFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
