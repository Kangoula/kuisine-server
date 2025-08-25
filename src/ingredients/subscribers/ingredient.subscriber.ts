import {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { IngredientsService } from '../ingredients.service';
import { Ingredient } from '../entities/ingredient.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IngredientSubscriber
  implements EntitySubscriberInterface<Ingredient>
{
  constructor(
    dataSource: DataSource,
    private readonly ingredientsService: IngredientsService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Ingredient;
  }

  async afterInsert(event: InsertEvent<Ingredient>): Promise<void> {
    await this.updateSearchVector(event);
  }

  // TODO check whether the name changed or not
  // async afterUpdate(event: UpdateEvent<Ingredient>): Promise<void> {
  //   await this.updateSearchVector(event);
  // }

  private async updateSearchVector(
    event: UpdateEvent<Ingredient> | InsertEvent<Ingredient>,
  ): Promise<void> {
    if (!event.entity?.id) return;

    console.log(event.entity.id);
    await this.ingredientsService.updateFullTextSearch(+event.entity.id);
  }
}
