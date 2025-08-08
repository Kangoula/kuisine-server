import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { BaseEntityService } from 'src/common/base-entity.service';

@Injectable()
export class RecipesService extends BaseEntityService(Recipe) {
  create(createRecipeDto: CreateRecipeDto) {
    const recipe = new Recipe();
    recipe.name = createRecipeDto.name;
    recipe.servings = createRecipeDto.servings;

    return this.repository.save(recipe);
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return this.repository.update(id, updateRecipeDto);
  }

  remove(id: number) {
    return this.repository.softDelete({ id });
  }
}
