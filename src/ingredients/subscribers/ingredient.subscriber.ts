import { DataSource, InsertEvent, UpdateEvent } from 'typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import { Injectable } from '@nestjs/common';
import { BaseEntitySubscriber } from '@/common/base-entity.subscriber';

@Injectable()
export class IngredientSubscriber extends BaseEntitySubscriber(Ingredient) {
  constructor(dataSource: DataSource) {
    super(dataSource);
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

    // update the column in the same transaction, thus not using ingredientsService
    await event.manager.getRepository(Ingredient).update(event.entity.id, {
      fullTextSearch: () => "to_tsvector('french', name)",
    });
  }
}
