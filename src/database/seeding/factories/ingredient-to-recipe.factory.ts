import { IngredientToRecipe } from '@/ingredient-to-recipe/entities/ingredient-to-recipe.entity';
import { setSeederFactory } from 'typeorm-extension';

export const IngredientToRecipeFactory = setSeederFactory(
  IngredientToRecipe,
  (faker) => {
    const recipeIngredient = new IngredientToRecipe();

    recipeIngredient.order = 1;
    recipeIngredient.quantity = faker.number.int({ min: 1, max: 300 });
    recipeIngredient.quantityUnit = faker.helpers.arrayElement([
      undefined,
      'g',
      'kg',
      'ml',
      'cl',
      'pincée',
      'càs',
      'càc',
    ]);

    return recipeIngredient;
  },
);
