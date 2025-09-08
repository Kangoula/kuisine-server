import { Injectable } from '@nestjs/common';
import { IngredientToRecipe } from './entities/ingredient-to-recipe.entity';
import { CreateIngredientToRecipeDto } from './dto/create-ingredient-to-recipe.dto';
import { RecipesService } from '@/recipes/recipes.service';
import { IngredientsService } from '@/ingredients/ingredients.service';
import { BaseEntityService } from '@/common/mixins/base-entity-service.mixin';

@Injectable()
export class IngredientToRecipeService extends BaseEntityService(
  IngredientToRecipe,
) {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly ingredientsService: IngredientsService,
  ) {
    super();
  }

  async create(createIngredientToRecipeDto: CreateIngredientToRecipeDto) {
    const ingredientToRecipe = new IngredientToRecipe();

    ingredientToRecipe.recipe = await this.recipesService.findOne(
      createIngredientToRecipeDto.recipeId,
    );

    ingredientToRecipe.ingredient = await this.ingredientsService.findOne(
      createIngredientToRecipeDto.ingredientId,
    );

    ingredientToRecipe.order = createIngredientToRecipeDto.order;
    ingredientToRecipe.quantity = createIngredientToRecipeDto.quantity;
    ingredientToRecipe.quantityUnit = createIngredientToRecipeDto.quantityUnit;

    return this.repository.save(ingredientToRecipe);
  }
}
