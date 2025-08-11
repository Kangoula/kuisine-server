import { Recipe } from '@/recipes/entities/recipe.entity';
import { setSeederFactory } from 'typeorm-extension';

export const RecipeFactory = setSeederFactory(Recipe, (faker) => {
  const recipe = new Recipe();

  recipe.name = faker.lorem.words({ min: 1, max: 4 });
  recipe.servings = faker.number.int({ min: 1, max: 10 });

  return recipe;
});
