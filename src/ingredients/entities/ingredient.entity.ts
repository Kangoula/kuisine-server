import { Column, Entity, OneToMany } from 'typeorm';
import { IngredientToRecipe } from '@/ingredient-to-recipe/entities/ingredient-to-recipe.entity';
import { Exclude } from 'class-transformer';
import { BaseEntity, IsSoftDeletable, IsTimestampable } from '@/common/mixins';
import { Mixin } from 'ts-mixer';

@Entity()
export class Ingredient extends Mixin(
  BaseEntity,
  IsSoftDeletable,
  IsTimestampable,
) {
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
