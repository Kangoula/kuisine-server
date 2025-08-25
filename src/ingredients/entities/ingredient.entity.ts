import { Column, Entity, OneToMany } from 'typeorm';
import { SoftDeletableEntity } from '@/common/entities/soft-deletable.entity';
import { IngredientToRecipe } from '@/ingredient-to-recipe/entities/ingredient-to-recipe.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Ingredient extends SoftDeletableEntity {
  @Column({ type: 'varchar', precision: 255, unique: true })
  name: string;

  @OneToMany(
    () => IngredientToRecipe,
    (ingredientToRecipe) => ingredientToRecipe.ingredient,
  )
  ingredientToRecipe: IngredientToRecipe[];

  @Exclude()
  @Column({
    type: 'tsvector',
    nullable: true,
    select: false,
  })
  fullTextSearch?: string | null;
}
