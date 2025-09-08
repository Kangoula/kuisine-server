import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { RecipesService } from './recipes.service';
import { EntityFactory } from '@/common/helpers';
import { Recipe } from './entities/recipe.entity';

@Injectable()
export class RecipesSeeder implements Seeder {
  constructor(private readonly recipesService: RecipesService) {}

  async seed(): Promise<any> {
    const recipes = EntityFactory.createMany(Recipe, 11);

    return Promise.all(recipes.map((d) => this.recipesService.create(d)));
  }

  async drop(): Promise<any> {
    return this.recipesService.repository.deleteAll();
  }
}
