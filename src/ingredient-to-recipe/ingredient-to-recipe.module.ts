import { forwardRef, Module } from '@nestjs/common';
import { IngredientToRecipeService } from './ingredient-to-recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientToRecipe } from './entities/ingredient-to-recipe.entity';
import { RecipesModule } from 'src/recipes/recipes.module';
import { IngredientsModule } from 'src/ingredients/ingredients.module';
import { IngredientToRecipeController } from './ingredient-to-recipe.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([IngredientToRecipe]),
    forwardRef(() => RecipesModule),
    IngredientsModule,
  ],
  providers: [IngredientToRecipeService],
  exports: [IngredientToRecipeService],
  controllers: [IngredientToRecipeController],
})
export class IngredientToRecipeModule {}
