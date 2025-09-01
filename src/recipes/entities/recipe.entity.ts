import { SoftDeletableEntity } from '@/common/entities/soft-deletable.entity';
import { IngredientToRecipe } from '@/ingredient-to-recipe/entities/ingredient-to-recipe.entity';
import { RecipeStep } from '@/recipe-steps/entities/recipe-step.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Recipe extends SoftDeletableEntity {
  @Column({ type: 'varchar', precision: 255 })
  name: string;

  @Column({ type: 'smallint' })
  servings: number;

  @Column({ type: 'smallint' })
  cookingDurationMinutes: number;

  @Column({ type: 'smallint' })
  preparationDurationMinutes: number;

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
