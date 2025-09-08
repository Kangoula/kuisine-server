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
  @Factory(
    (faker, ctx: Partial<IngredientToRecipe>) =>
      ctx.ingredientId ?? ctx.ingredient?.id,
  )
  @Column()
  ingredientId: number;

  @Factory(
    (faker, ctx: Partial<IngredientToRecipe>) => ctx.recipeId ?? ctx.recipe?.id,
  )
  @Column()
  recipeId: number;

  @Factory(
    (faker, ctx: Partial<IngredientToRecipe>) =>
      ctx.order ?? faker?.number.int({ min: 1 }),
  )
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
      ctx.quantityUnit ??
      faker?.helpers.objectValue({ ...QuantityUnits, None: null }),
  )
  @Column({ type: 'varchar', precision: 255, nullable: true })
  quantityUnit?: QuantityUnits | null;

  @Factory((faker, ctx: Partial<IngredientToRecipe>) => ctx.ingredient)
  @ManyToOne(() => Ingredient, (ingredient) => ingredient.ingredientToRecipes)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @Factory((faker, ctx: Partial<IngredientToRecipe>) => ctx.recipe)
  @ManyToOne(() => Recipe, (recipe) => recipe.ingredientToRecipes)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
