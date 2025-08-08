import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IngredientToRecipe } from './entities/ingredient-to-recipe.entity';
import { Repository } from 'typeorm';
import { CreateIngredientToRecipeDto } from './dto/create-ingredient-to-recipe.dto';
import { RecipesService } from 'src/recipes/recipes.service';
import { IngredientsService } from 'src/ingredients/ingredients.service';
import { UpdateIngredientToRecipeDto } from './dto/update-ingredient-to-recipe.dto';
import { BaseEntityService } from 'src/common/base-entity.service';

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

    ingredientToRecipe.ingredient = await this.ingredientsService.findOne(
      createIngredientToRecipeDto.ingredientId,
    );

    ingredientToRecipe.order = createIngredientToRecipeDto.order;
    ingredientToRecipe.quantity = createIngredientToRecipeDto.quantity;
    ingredientToRecipe.quantityUnit = createIngredientToRecipeDto.quantityUnit;

    return this.repository.save(ingredientToRecipe);
  }

  // TODO utiliser les param find
  findByRecipeId(recipeId: number) {
    return this.repository
      .createQueryBuilder('ingredientToRecipe')
      .leftJoinAndSelect('ingredientToRecipe.ingredient', 'ingredient')
      .select([
        'ingredientToRecipe.id',
        'ingredientToRecipe.order',
        'ingredientToRecipe.quantity',
        'ingredientToRecipe.quantityUnit',
        'ingredient.id',
        'ingredient.name',
      ])

      .where('ingredientToRecipe.recipeId = :id', { id: recipeId })
      .orderBy('ingredientToRecipe.order')
      .getMany();
  }
}
