import { randomInt } from '@/common/helpers';
import { RecipeStep } from '../../recipe-steps/entities/recipe-step.entity';
import { Recipe } from '../../recipes/entities/recipe.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Ingredient } from '@/ingredients/entities/ingredient.entity';
import { IngredientToRecipe } from '@/ingredient-to-recipe/entities/ingredient-to-recipe.entity';
import { sample } from 'remeda';

const RECIPES_COUNT = 10;
const MAX_RECIPE_STEPS_COUNT = 8;
const INGREDIENTS_COUNT = 3000;
const MAX_RECIPE_INGREDIENTS = 7;

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const ingredients = await this.seedIngredients(factoryManager);
    const recipes = await this.seedRecipes(factoryManager, ingredients);
  }

  private async seedRecipes(
    factoryManager: SeederFactoryManager,
    ingredients: Ingredient[],
  ): Promise<Recipe[]> {
    console.log('seeding recipes...');

    const recipeFactory = factoryManager.get(Recipe);

    const recipes = Promise.all(
      Array(RECIPES_COUNT)
        .fill('')
        .map(async () => {
          const recipe = await recipeFactory.save();

          this.createStepsForRecipe(factoryManager, recipe);
          this.addRandomIngredientsToRecipe(
            factoryManager,
            recipe,
            ingredients,
          );

          return recipe;
        }),
    );

    console.log(`recipes created`);

    return recipes;
  }

  private async createStepsForRecipe(
    factoryManager: SeederFactoryManager,
    recipe: Recipe,
  ) {
    const stepFactory = factoryManager.get(RecipeStep);

    const stepsCount = randomInt(1, MAX_RECIPE_STEPS_COUNT);

    await Promise.all(
      Array(stepsCount)
        .fill('')
        .map((_, i) => {
          return stepFactory.save({
            recipe: recipe,
            order: i + 1,
          });
        }),
    );
  }

  private addRandomIngredientsToRecipe(
    factoryManager: SeederFactoryManager,
    recipe: Recipe,
    ingredients: Ingredient[],
  ) {
    const factory = factoryManager.get(IngredientToRecipe);

    const recipeIngredients = sample(
      ingredients,
      randomInt(1, MAX_RECIPE_INGREDIENTS),
    );

    recipeIngredients.forEach((recipeIngredient, i) => {
      factory.save({
        order: i + 1,
        recipe,
        ingredient: recipeIngredient,
      });
    });
  }

  private async seedIngredients(factoryManager: SeederFactoryManager) {
    console.log('seeding ingredients...');

    const ingredientFactory = factoryManager.get(Ingredient);
    const ingredients = await ingredientFactory.saveMany(INGREDIENTS_COUNT);

    console.log('ingredients created');

    return ingredients;
  }
}
