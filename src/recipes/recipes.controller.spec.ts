import { Mocked } from '@suites/doubles.jest';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { TestBed } from '@suites/unit';
import { Recipe } from './entities/recipe.entity';
import { EntityNotFoundError } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { generateOne } from '~test-utils';

describe('RecipesController', () => {
  let controller: RecipesController;
  let service: Mocked<RecipesService>;

  beforeEach(async () => {
    const { unit, unitRef } =
      await TestBed.solitary(RecipesController).compile();

    controller = unit;
    service = unitRef.get(RecipesService);
  });

  it('should create a recipe', async () => {
    const user = generateOne(User);
    user.id = 1;

    const recipeToCreate = {
      name: "le pudding a l'arsenic",
      servings: 2,
      cookingDurationMinutes: 2,
      preparationDurationMinutes: 2,
      userId: 1,
    };

    const createdRecipe = generateOne(Recipe, recipeToCreate);
    createdRecipe.id = 1;

    service.create.mockResolvedValue(createdRecipe);

    const result = await controller.create(user, recipeToCreate);

    expect(service.create).toHaveBeenCalledWith(recipeToCreate);
    expect(result).toEqual(createdRecipe);
  });

  it("should create a recipe with the user's id when not specifiyed", async () => {
    const user = generateOne(User);
    user.id = 2;

    const recipeToCreate = {
      name: "le pudding a l'arsenic",
      servings: 2,
      cookingDurationMinutes: 2,
      preparationDurationMinutes: 2,
    };

    const createdRecipe = generateOne(Recipe, { ...recipeToCreate, user });
    createdRecipe.id = 1;

    service.create.mockResolvedValue(createdRecipe);

    const result = await controller.create(user, recipeToCreate);

    expect(service.create).toHaveBeenCalledWith({
      ...recipeToCreate,
      userId: user.id,
    });
    expect(result).toEqual(createdRecipe);
  });

  it('should call service.remove if recipe exists', async () => {
    const recipe = generateOne(Recipe);
    recipe.id = 1;

    service.findOne.mockResolvedValue(recipe);

    await controller.remove(recipe.id);

    expect(service.findOne).toHaveBeenCalledWith(recipe.id);
    expect(service.remove).toHaveBeenCalledWith(recipe.id);
  });

  it('should throw when trying to remove a recipe that does not exists', async () => {
    const recipe = generateOne(Recipe);
    recipe.id = 1;

    const notFoundError = new EntityNotFoundError(Recipe, { id: recipe.id });

    service.findOne.mockRejectedValue(notFoundError);

    await expect(controller.remove(recipe.id)).rejects.toThrow(notFoundError);

    expect(service.findOne).toHaveBeenCalledWith(recipe.id);
    expect(service.remove).not.toHaveBeenCalled();
  });
});
