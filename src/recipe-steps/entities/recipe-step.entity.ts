import { BaseEntity, IsSoftDeletable, IsTimestampable } from '@/common/mixins';
import { Recipe } from '@/recipes/entities/recipe.entity';
import { Mixin } from 'ts-mixer';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class RecipeStep extends Mixin(
  BaseEntity,
  IsSoftDeletable,
  IsTimestampable,
) {
  @Column({ type: 'smallint' })
  order: number;

  @Column('text')
  description: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.steps)
  recipe: Recipe;
}
