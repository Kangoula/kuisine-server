import { DataSource, InsertEvent, UpdateEvent } from 'typeorm';
import { IngredientsService } from '../ingredients.service';
import { Ingredient } from '../entities/ingredient.entity';
import { Injectable } from '@nestjs/common';
import { BaseEntitySubscriber } from '@/common/base-entity.subscriber';

@Injectable()
// implements EntitySubscriberInterface<Ingredient>
export class IngredientSubscriber extends BaseEntitySubscriber(Ingredient) {
  constructor(
    dataSource: DataSource,
    private readonly ingredientsService: IngredientsService,
  ) {
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

    console.log(event.entity.id);
    await this.ingredientsService.updateFullTextSearch(+event.entity.id);
  }
}
