import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { RecipesModule } from './recipes/recipes.module';
import { ConfigModule } from '@nestjs/config';
import { IngredientsModule } from './ingredients/ingredients.module';
import { RecipeStepsModule } from './recipe-steps/recipe-steps.module';
import { IngredientToRecipeModule } from './ingredient-to-recipe/ingredient-to-recipe.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          transformOptions: { enableImplicitConversion: true },
        }),
    },
    // à mettre en dernier pour ne pas se faire court-cicuiter par d'autres pipe ou interceptors globaux
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    RecipesModule,
    IngredientsModule,
    RecipeStepsModule,
    IngredientToRecipeModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
