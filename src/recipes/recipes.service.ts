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

    return this.repository.save(recipe);
  }
}
