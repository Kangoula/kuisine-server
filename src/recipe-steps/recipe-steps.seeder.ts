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

    const steps: RecipeStep[] = [];
    recipes.forEach((recipe) => {
      steps.push(
        ...EntityFactory.createMany(RecipeStep, randomInt(1, 10), {
          recipe,
        }),
      );
    });

    return Promise.all(
      steps.map(({ recipe, ...step }) =>
        this.service.create({
          ...step,
          recipeId: recipe.id,
        }),
      ),
    );
  }

  async drop(): Promise<any> {}
}
