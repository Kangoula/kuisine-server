import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe) private recipeRepository: Repository<Recipe>,
  ) {}

  create(createRecipeDto: CreateRecipeDto) {
    const recipe = new Recipe();
    recipe.name = createRecipeDto.name;
    recipe.servings = createRecipeDto.servings;

    return this.recipeRepository.save(recipe);
  }

  findAll() {
    return this.recipeRepository.find();
  }

  findOne(id: number) {
    return this.recipeRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    await this.recipeRepository.findOneByOrFail({ id });

    return this.recipeRepository.update(id, updateRecipeDto);
  }

  async remove(id: number) {
    await this.recipeRepository.findOneByOrFail({ id });

    return this.recipeRepository.softDelete(id);
  }
}
