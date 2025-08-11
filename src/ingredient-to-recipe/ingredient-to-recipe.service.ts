import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { IngredientToRecipe } from './entities/ingredient-to-recipe.entity';
import { CreateIngredientToRecipeDto } from './dto/create-ingredient-to-recipe.dto';
import { RecipesService } from '@/recipes/recipes.service';
import { IngredientsService } from '@/ingredients/ingredients.service';
import { BaseEntityService } from '@/common/base-entity.service';

@Injectable()
export class IngredientToRecipeService extends BaseEntityService(
  IngredientToRecipe,
) {
  constructor(
    @Inject(forwardRef(() => RecipesService))
    private recipesService: RecipesService,
    private ingredientsService: IngredientsService,
  ) {
    super();
  }

  async create(createIngredientToRecipeDto: CreateIngredientToRecipeDto) {
    const ingredientToRecipe = new IngredientToRecipe();

    ingredientToRecipe.recipe = await this.recipesService.findOneOrFail(
      createIngredientToRecipeDto.recipeId,
    );

    ingredientToRecipe.ingredient = await this.ingredientsService.findOneOrFail(
      createIngredientToRecipeDto.ingredientId,
    );

    ingredientToRecipe.order = createIngredientToRecipeDto.order;
    ingredientToRecipe.quantity = createIngredientToRecipeDto.quantity;
    ingredientToRecipe.quantityUnit = createIngredientToRecipeDto.quantityUnit;

    return this.repository.save(ingredientToRecipe);
  }

  findByRecipeId(recipeId: number) {
    return this.repository.find({
      relations: {
        ingredient: true,
      },
      select: {
        id: true,
        order: true,
        quantity: true,
        quantityUnit: true,

        ingredient: {
          id: true,
          name: true,
        },
      },
      where: {
        recipeId: recipeId,
      },
      order: {
        order: 'ASC',
      },
    });
  }
}
