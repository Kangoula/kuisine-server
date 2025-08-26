import { Ingredient } from '@/ingredients/entities/ingredient.entity';
import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';

const usedNames: string[] = [];

// it could lead to an infinite recursion loop,
// but we use the factory in dev only
const _generateName = (faker: Faker): string => {
  const name: string = faker.lorem.words({ min: 1, max: 3 });
  if (usedNames.includes(name)) {
    return _generateName(faker);
  }

  usedNames.push(name);
  return name;
};

export const IngredientFactory = setSeederFactory(Ingredient, (faker) => {
  const ingredient = new Ingredient();

  ingredient.name = _generateName(faker);

  return ingredient;
});
