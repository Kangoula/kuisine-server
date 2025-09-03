import { BaseEntity, IsSoftDeletable } from '@/common/mixins';
import { Recipe } from '@/recipes/entities/recipe.entity';
import { Mixin } from 'ts-mixer';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class RecipeStep extends Mixin(BaseEntity, IsSoftDeletable) {
  @Column({ type: 'smallint' })
  order: number;

  @Column('text')
  description: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.steps)
  recipe: Recipe;
}
