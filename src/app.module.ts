import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { RecipesModule } from './recipes/recipes.module';
import { ConfigModule } from '@nestjs/config';
import { IngredientsModule } from './ingredients/ingredients.module';
import { RecipeStepsModule } from './recipe-steps/recipe-steps.module';
import { IngredientToRecipeModule } from './ingredient-to-recipe/ingredient-to-recipe.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import * as Joi from '@hapi/joi';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
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
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    RecipesModule,
    IngredientsModule,
    RecipeStepsModule,
    IngredientToRecipeModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
