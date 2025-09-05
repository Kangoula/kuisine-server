import { BaseEntity, IsSoftDeletable, IsTimestampable } from '@/common/mixins';
import { Recipe } from '@/recipes/entities/recipe.entity';
import { Factory } from 'nestjs-seeder';
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

  @Factory(
    (faker, ctx: Partial<RecipeStep>) =>
      ctx.description ?? faker?.lorem.paragraph(),
  )
  @Column('text')
  description: string;

  @Factory((faker, ctx: Partial<RecipeStep>) => ctx.recipe)
  @ManyToOne(() => Recipe, (recipe) => recipe.steps)
  recipe: Recipe;
}
