import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RecipesModule } from './recipes/recipes.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config/typeorm';
import { IngredientsModule } from './ingredients/ingredients.module';
import { RecipeStepsModule } from './recipe-steps/recipe-steps.module';
import { IngredientToRecipeModule } from './ingredient-to-recipe/ingredient-to-recipe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(config),
    RecipesModule,
    IngredientsModule,
    RecipeStepsModule,
    IngredientToRecipeModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
