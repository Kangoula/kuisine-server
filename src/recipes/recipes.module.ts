import { forwardRef, Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { IngredientToRecipeModule } from 'src/ingredient-to-recipe/ingredient-to-recipe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe]),
    forwardRef(() => IngredientToRecipeModule),
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
