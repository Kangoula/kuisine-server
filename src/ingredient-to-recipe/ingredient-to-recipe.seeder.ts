import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { IngredientToRecipeService } from './ingredient-to-recipe.service';

@Injectable()
export class IngredientToRecipeSeeder implements Seeder {
  constructor(private readonly service: IngredientToRecipeService) {}

  async seed(): Promise<any> {
    // const names = faker.helpers.uniqueArray(
    //   () => faker.lorem.words({ min: 1, max: 3 }),
    //   1000,
    // );
    // return Promise.all(
    //   names.map((name) =>
    //     this.ingredientsService.create(
    //       EntityFactory.createOne(Ingredient, { name }),
    //     ),
    //   ),
    // );
  }

  async drop(): Promise<any> {
    return this.service.repository.deleteAll();
  }
}
