import { RecipeStep } from '@/recipe-steps/entities/recipe-step.entity';
import { setSeederFactory } from 'typeorm-extension';

export const RecipeStepFactory = setSeederFactory(RecipeStep, (faker) => {
  const recipe = new RecipeStep();

  recipe.order = 1;
  recipe.description = faker.lorem.sentences({ min: 1, max: 5 });

  return recipe;
});
