import { SoftDeletableEntity } from 'src/common/entities/soft-deletable.entity';
import { IngredientToRecipe } from 'src/ingredient-to-recipe/entities/ingredient-to-recipe.entity';
import { RecipeStep } from 'src/recipe-steps/entities/recipe-step.entity';
import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';

@Entity()
export class Recipe extends SoftDeletableEntity {
  @Column({ type: 'varchar', precision: 255 })
  name: string;

  @Column({ type: 'smallint', unsigned: true })
  servings: number;

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
