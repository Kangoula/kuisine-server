import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IngredientToRecipe } from './entities/ingredient-to-recipe.entity';
import { Repository } from 'typeorm';
import { CreateIngredientToRecipeDto } from './dto/create-ingredient-to-recipe.dto';
import { RecipesService } from 'src/recipes/recipes.service';
import { IngredientsService } from 'src/ingredients/ingredients.service';
import { UpdateIngredientToRecipeDto } from './dto/update-ingredient-to-recipe.dto';

@Injectable()
export class IngredientToRecipeService {
  constructor(
    @InjectRepository(IngredientToRecipe)
    private ingredientToRecipeRepository: Repository<IngredientToRecipe>,
    @Inject(forwardRef(() => RecipesService))
    private recipesService: RecipesService,
    private ingredientsService: IngredientsService,
  ) {}

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

    return this.ingredientToRecipeRepository.save(ingredientToRecipe);
  }

  findOne(id: number) {
    return this.ingredientToRecipeRepository.findOneByOrFail({ id });
  }

  findByRecipeId(recipeId: number) {
    return this.ingredientToRecipeRepository
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

  async update(
    id: number,
    updateIngredientToRecipeDto: UpdateIngredientToRecipeDto,
  ) {
    await this.findOne(id);

    return this.ingredientToRecipeRepository.update(
      id,
      updateIngredientToRecipeDto,
    );
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.ingredientToRecipeRepository.softDelete(id);
  }
}
