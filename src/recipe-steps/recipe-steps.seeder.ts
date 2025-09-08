import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { EntityFactory, randomInt } from '@/common/helpers';
import { RecipeStepsService } from './recipe-steps.service';
import { RecipeStep } from './entities/recipe-step.entity';
import { RecipesService } from '@/recipes/recipes.service';

@Injectable()
export class RecipeStepsSeeder implements Seeder {
  constructor(
    private readonly service: RecipeStepsService,
    private readonly recipesService: RecipesService,
  ) {}

  async seed(): Promise<any> {
    const recipes = await this.recipesService.findAll();

    const steps = recipes.flatMap((recipe) => {
      return EntityFactory.createMany(RecipeStep, randomInt(1, 10), {
        recipe,
      }).map((step, idx) => ({
        ...step,
        order: idx + 1,
        recipeId: recipe.id,
      }));
    });

    return Promise.all(steps.map((step) => this.service.create(step)));
  }

  async drop(): Promise<any> {
    return this.service.repository.deleteAll();
  }
}
