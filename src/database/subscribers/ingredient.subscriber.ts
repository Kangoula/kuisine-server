import { Ingredient } from '@/ingredients/entities/ingredient.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class IngredientSubscriber
  implements EntitySubscriberInterface<Ingredient>
{
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

    await event.manager.query(
      `
      UPDATE ingredient 
      SET full_text_search = to_tsvector('simple',ingredient.name)
      WHERE ingredient.id = $1
      `,
      [event.entity.id],
    );
  }
}
