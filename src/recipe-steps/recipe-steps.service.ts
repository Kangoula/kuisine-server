import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateRecipeStepDto } from './dto/create-recipe_step.dto';
import { RecipeStep } from './entities/recipe-step.entity';
import { Repository } from 'typeorm';
import { RecipesService } from '@/recipes/recipes.service';
import { BaseEntityService } from '@/common/base-entity.service';

@Injectable()
export class RecipeStepsService extends BaseEntityService(RecipeStep) {
  constructor(
    @Inject(forwardRef(() => RecipesService))
    private recipeService: RecipesService,
  ) {
    super();
  }

  async create(createRecipeStepDto: CreateRecipeStepDto) {
    const step = new RecipeStep();
    step.order = createRecipeStepDto.order;
    step.description = createRecipeStepDto.description;
    step.recipe = await this.recipeService.findOneOrFail(
      createRecipeStepDto.recipeId,
    );

    return this.repository.save(step);
  }
}
