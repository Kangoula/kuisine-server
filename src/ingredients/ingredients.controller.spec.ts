import { IngredientsService } from './ingredients.service';
import { Mocked, TestBed } from '@suites/unit';
import { IngredientsController } from './ingredients.controller';
import { Ingredient } from './entities/ingredient.entity';
import { generateOne } from '~test-utils';

describe('IngredientsController', () => {
  let controller: IngredientsController;
  let service: Mocked<IngredientsService>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(
      IngredientsController,
    ).compile();

    controller = unit;
    service = unitRef.get(IngredientsService);
  });

  describe('create', () => {
    it('should create a new Ingredient', async () => {
      const expectedIngredient = generateOne(Ingredient);
      expectedIngredient.id = 1;

      const newIngredient = { name: 'Boux de Chruxelles' };

      service.create.mockResolvedValue(expectedIngredient);

      const createdIngredient = await controller.create(newIngredient);

      expect(service.create).toHaveBeenCalledWith(newIngredient);
      expect(createdIngredient).toBeDefined();
      expect(createdIngredient).toEqual<Ingredient>(expectedIngredient);
    });
  });
});
