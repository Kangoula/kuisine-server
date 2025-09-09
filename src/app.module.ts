import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { RecipesModule } from './recipes/recipes.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { RecipeStepsModule } from './recipe-steps/recipe-steps.module';
import { IngredientToRecipeModule } from './ingredient-to-recipe/ingredient-to-recipe.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CaslModule } from './casl/casl.module';
import { PermissionsGuard } from './casl/permissions.guard';
import { RolesModule } from './roles/roles.module';
import { IsUniqueContraintValidator } from './common/validators/is-unique-contstraint.validator';
import { ConfigModule } from './config/config.module';
import { SchedulingModule } from './scheduling/scheduling.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
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
    ConfigModule,
    DatabaseModule,
    SchedulingModule,
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
