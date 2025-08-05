import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [RecipesModule],
  controllers: [AppController],
})
export class AppModule {}
