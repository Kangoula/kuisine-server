import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RecipesModule } from './recipes/recipes.module';
import { ConfigModule } from '@nestjs/config';
import { IngredientsModule } from './ingredients/ingredients.module';
import { RecipeStepsModule } from './recipe-steps/recipe-steps.module';
import { IngredientToRecipeModule } from './ingredient-to-recipe/ingredient-to-recipe.module';
import { DatabaseModule } from './database/database.module';

@Module({
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
  ],
  controllers: [AppController],
})
export class AppModule {}
