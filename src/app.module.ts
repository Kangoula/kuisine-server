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
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CaslModule } from './casl/casl.module';
import * as Joi from '@hapi/joi';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import { PoliciesGuard } from './casl/policies.guard';
import { RolesModule } from './roles/roles.module';
import { IsUniqueContraintValidator } from './common/validators/is-unique-contstraint.validator';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          transformOptions: { enableImplicitConversion: true },
        }),
    },
    // this interceptors must be loaded last to be applied last, this is to avoid clashes with other pipes or interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    IsUniqueContraintValidator,
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, databaseConfig],
      // ensure all env variables are present before starting
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    RecipesModule,
    IngredientsModule,
    RecipeStepsModule,
    IngredientToRecipeModule,
    UsersModule,
    AuthModule,
    CaslModule,
    RolesModule,
  ],
})
export class AppModule {}
