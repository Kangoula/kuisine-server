import { BaseEntity, IsSoftDeletable, IsTimestampable } from '@/common/mixins';
import { IngredientToRecipe } from '@/ingredient-to-recipe/entities/ingredient-to-recipe.entity';
import { RecipeStep } from '@/recipe-steps/entities/recipe-step.entity';
import { User } from '@/users/entities/user.entity';
import { Factory } from 'nestjs-seeder';
import { Mixin } from 'ts-mixer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Recipe extends Mixin(
  BaseEntity,
  IsSoftDeletable,
  IsTimestampable,
) {
  @Factory(
    (faker, ctx: Partial<Recipe>) =>
      ctx.name ?? faker?.lorem.words({ min: 1, max: 4 }),
  )
  @Column({ type: 'varchar', precision: 255 })
  name: string;

  @Factory(
    (faker, ctx: Partial<Recipe>) =>
      ctx.servings ?? faker?.number.int({ min: 1, max: 10 }),
  )
  @Column({ type: 'smallint' })
  servings: number;

  @Factory(
    (faker, ctx: Partial<Recipe>) =>
      ctx.cookingDurationMinutes ?? faker?.number.int({ min: 1, max: 480 }),
  )
  @Column({ type: 'smallint' })
  cookingDurationMinutes: number;

  @Factory(
    (faker, ctx: Partial<Recipe>) =>
      ctx.preparationDurationMinutes ?? faker?.number.int({ min: 1, max: 120 }),
  )
  @Column({ type: 'smallint' })
  preparationDurationMinutes: number;

  @Factory((faker, ctx: Partial<Recipe>) => ctx.userId || ctx.user?.id)
  @Column({ type: 'int' })
  userId?: number;

  @Factory((faker, ctx: Partial<Recipe>) => ctx.user)
  @ManyToOne(() => User)
  user?: User;

  @OneToMany(() => RecipeStep, (recipeStep) => recipeStep.recipe, {
    cascade: true,
  })
  steps: RecipeStep[];

  @OneToMany(
    () => IngredientToRecipe,
    (ingredientToRecipe) => ingredientToRecipe.recipe,
  )
  ingredientToRecipe: IngredientToRecipe[];
}
