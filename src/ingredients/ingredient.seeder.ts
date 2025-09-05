import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { EntityFactory } from '@/common/helpers';
import { IngredientsService } from './ingredients.service';
import { Ingredient } from './entities/ingredient.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class IngredientsSeeder implements Seeder {
  constructor(private readonly ingredientsService: IngredientsService) {}

  async seed(): Promise<any> {
    const names = faker.helpers.uniqueArray(
      () => faker.lorem.words({ min: 1, max: 3 }),
      1000,
    );

    return Promise.all(
      names.map((name) =>
        this.ingredientsService.create(
          EntityFactory.createOne(Ingredient, { name }),
        ),
      ),
    );
  }

  async drop(): Promise<any> {}
}
