import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateRecipeStepDto } from './dto/create-recipe_step.dto';
import { UpdateRecipeStepDto } from './dto/update-recipe_step.dto';
import { RecipeStep } from './entities/recipe-step.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipesService } from 'src/recipes/recipes.service';

@Injectable()
export class RecipeStepsService {
  constructor(
    @InjectRepository(RecipeStep)
    private recipeStepRepository: Repository<RecipeStep>,
    @Inject(forwardRef(() => RecipesService))
    private recipeService: RecipesService,
  ) {}

  async create(createRecipeStepDto: CreateRecipeStepDto) {
    const step = new RecipeStep();
    step.order = createRecipeStepDto.order;
    step.description = createRecipeStepDto.description;
    step.recipe = await this.recipeService.findOne(
      createRecipeStepDto.recipeId,
    );

    return this.recipeStepRepository.save(step);
  }

  findAll() {
    return this.recipeStepRepository.find();
  }

  findOne(id: number) {
    return this.recipeStepRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateRecipeStepDto: UpdateRecipeStepDto) {
    await this.findOne(id);

    return this.recipeStepRepository.update(id, updateRecipeStepDto);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.recipeStepRepository.softDelete(id);
  }
}
