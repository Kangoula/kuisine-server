import { Test, TestingModule } from '@nestjs/testing';
import { RecipesService } from './recipes.service';
import { TestBed } from '@suites/unit';
import { Recipe } from './entities/recipe.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Mocked } from '@suites/doubles.jest';
import { Repository } from 'typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

describe('RecipesService', () => {
  let service: RecipesService;
  let repository: Mocked<Repository<Recipe>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(RecipesService).compile();

    service = unit;

    repository = unitRef.get(getRepositoryToken(Recipe) as string);
  });

  it('should create a recipe', async () => {
    const recipeToCreate: CreateRecipeDto = {
      name: "Le pudding à l'arsenic",
      servings: 4,
      cookingDurationMinutes: 30,
      preparationDurationMinutes: 10,
    };

    repository.save.mockResolvedValue({
      id: 1,
      steps: [],
      ingredientToRecipe: [],
      ...recipeToCreate,
    });

    const result = await service.create(recipeToCreate);

    expect(repository.save).toHaveBeenCalledWith(recipeToCreate);
    expect(result).toEqual(expect.objectContaining(recipeToCreate));
  });

  it('should update a recipe', async () => {
    const updateData: UpdateRecipeDto = {
      name: 'Le pudding à la saucisse',
      servings: 2,
    };

    const recipeId = 66;

    repository.update.mockResolvedValue({
      affected: 1,
      raw: [],
      generatedMaps: [],
    });

    const result = await service.update(66, updateData);

    expect(repository.update).toHaveBeenCalledWith(66, updateData);
    expect(result.affected).toBe(1);
  });

  it('should soft delete recipe', async () => {
    const recipeId = 1;

    await service.remove(recipeId);

    expect(repository.softDelete).toHaveBeenCalledWith(recipeId);
  });
});
