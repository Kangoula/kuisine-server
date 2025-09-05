import { BaseEntity, IsSoftDeletable, IsTimestampable } from '@/common/mixins';
import { Ingredient } from '@/ingredients/entities/ingredient.entity';
import { Recipe } from '@/recipes/entities/recipe.entity';
import { Factory } from 'nestjs-seeder';
import { Mixin } from 'ts-mixer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum QuantityUnits {
  Grams = 'Grams',
  Kilograms = 'Kilograms',
  Milliliters = 'Milliliters',
  Centiliters = 'Centiliters',
  Pinches = 'Pinches',
  TableSpoon = 'TableSpoon',
  TeaSpoon = 'TeaSoon',
}

@Entity()
export class IngredientToRecipe extends Mixin(
  BaseEntity,
  IsSoftDeletable,
  IsTimestampable,
) {
  @Column()
  ingredientId: number;

  @Column()
  recipeId: number;

  @Column({ type: 'smallint' })
  order: number;

  @Factory(
    (faker, ctx: Partial<IngredientToRecipe>) =>
      ctx.quantity ?? faker?.number.int({ min: 1, max: 300 }),
  )
  @Column({ type: 'smallint' })
  quantity: number;

  @Factory(
    (faker, ctx: Partial<IngredientToRecipe>) =>
      ctx.quantityUnit ?? faker?.helpers.objectValue(QuantityUnits),
  )
  @Column({ type: 'varchar', precision: 255, nullable: true })
  quantityUnit?: QuantityUnits | undefined;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.ingredientToRecipe)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredientToRecipe)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
