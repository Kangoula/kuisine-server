import { Ingredient } from '@/ingredients/entities/ingredient.entity';
import { setSeederFactory } from 'typeorm-extension';

export const IngredientFactory = setSeederFactory(Ingredient, (faker) => {
  const ingredient = new Ingredient();

  ingredient.name = faker.lorem.word();

  return ingredient;
});
