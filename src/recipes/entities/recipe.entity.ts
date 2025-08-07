import { IngredientToRecipe } from 'src/ingredient-to-recipe/entities/ingredient-to-recipe.entity';
import { RecipeStep } from 'src/recipe-steps/entities/recipe-step.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', precision: 255 })
  name: string;

  @Column({ type: 'smallint', unsigned: true })
  servings: number;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

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
