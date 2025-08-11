import { SoftDeletableEntity } from '@/common/entities/soft-deletable.entity';
import { Recipe } from '@/recipes/entities/recipe.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class RecipeStep extends SoftDeletableEntity {
  @Column({ type: 'smallint', unsigned: true })
  order: number;

  @Column('text')
  description: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.steps)
  recipe: Recipe;
}
