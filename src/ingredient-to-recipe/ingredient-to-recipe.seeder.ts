import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { IngredientToRecipeService } from './ingredient-to-recipe.service';
import { RecipesService } from '@/recipes/recipes.service';
import { IngredientsService } from '@/ingredients/ingredients.service';
import { sample } from 'remeda';
import { EntityFactory, randomInt } from '@/common/helpers';
import { IngredientToRecipe } from './entities/ingredient-to-recipe.entity';

@Injectable()
export class IngredientToRecipeSeeder implements Seeder {
  constructor(
    private readonly service: IngredientToRecipeService,
    private readonly recipesServices: RecipesService,
    private readonly ingredientsService: IngredientsService,
  ) {}

  async seed(): Promise<any> {
    const ingredients = await this.ingredientsService.findAll();
    const recipes = await this.recipesServices.findAll();

    const createRequests = recipes.flatMap((recipe) => {
      const ingredientsSample = sample(ingredients, randomInt(1, 10));

      return ingredientsSample.map((ingredient, idx) => {
        const ingredientToRecipe = EntityFactory.createOne(IngredientToRecipe, {
          recipe: recipe,
          ingredient: ingredient,
          order: idx + 1,
        });

        return this.service.create(ingredientToRecipe);
      });
    });

    return Promise.all(createRequests);
  }

  async drop(): Promise<any> {
    return this.service.repository.deleteAll();
  }
}
