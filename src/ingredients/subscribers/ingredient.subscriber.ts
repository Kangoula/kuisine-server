import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { IngredientsService } from '../ingredients.service';
import { Ingredient } from '../entities/ingredient.entity';

@EventSubscriber()
export class IngredientSubscriber
  implements EntitySubscriberInterface<Ingredient>
{
  constructor(private readonly service: IngredientsService) {}

  listenTo() {
    return Ingredient;
  }

  async afterInsert(event: InsertEvent<Ingredient>): Promise<void> {
    await this.updateSearchVector(event);
  }

  async afterUpdate(event: UpdateEvent<Ingredient>): Promise<void> {
    await this.updateSearchVector(event);
  }

  private async updateSearchVector(
    event: UpdateEvent<Ingredient> | InsertEvent<Ingredient>,
  ): Promise<void> {
    if (!event.entity) return;

    await this.service.updateFullTextSearch(+event.entity.id);
  }
}
