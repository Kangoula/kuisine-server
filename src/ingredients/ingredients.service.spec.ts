import { IngredientsService } from './ingredients.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { Mocked } from '@suites/doubles.jest';
import { Repository } from 'typeorm';
import { TestBed } from '@suites/unit';

describe('IngredientsService', () => {
  let service: IngredientsService;
  let repository: Mocked<Repository<Ingredient>>;

  beforeEach(async () => {
    const { unit, unitRef } =
      await TestBed.solitary(IngredientsService).compile();

    service = unit;

    repository = unitRef.get(getRepositoryToken(Ingredient) as string);
  });

  it('should update only fullTextSearch column', async () => {
    await service.updateFullTextSearch(1);

    expect(repository.update).toHaveBeenCalledWith(1, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      fullTextSearch: expect.any(Function),
    });
  });
});
