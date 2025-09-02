import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { BaseEntityService } from '@/common/mixins/base-entity.service.mixin';

@Injectable()
export class RecipesService extends BaseEntityService(Recipe) {
  create(createRecipeDto: CreateRecipeDto) {
    const recipe = new Recipe();
    recipe.name = createRecipeDto.name;
    recipe.servings = createRecipeDto.servings;
    recipe.cookingDurationMinutes = createRecipeDto.cookingDurationMinutes;
    recipe.preparationDurationMinutes =
      createRecipeDto.preparationDurationMinutes;
    recipe.userId = createRecipeDto.userId;

    return this.repository.save(recipe);
  }
}
