import { Test, TestingModule } from '@nestjs/testing';
import { IngredientToRecipeController } from './ingredient-to-recipe.controller';

describe('IngredientToRecipeController', () => {
  let controller: IngredientToRecipeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngredientToRecipeController],
    }).compile();

    controller = module.get<IngredientToRecipeController>(IngredientToRecipeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
