import { Test, TestingModule } from '@nestjs/testing';
import { IngredientToRecipeService } from './ingredient-to-recipe.service';

describe('IngredientToRecipeService', () => {
  let service: IngredientToRecipeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngredientToRecipeService],
    }).compile();

    service = module.get<IngredientToRecipeService>(IngredientToRecipeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
