import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';
import { Recipe } from 'src/recipes/entities/recipe.entity';
import { SoftDeletableEntity } from 'src/common/entities/soft-deletable.entity';

@Entity()
export class IngredientToRecipe extends SoftDeletableEntity {
  @Column()
  ingredientId: number;

  @Column()
  recipeId: number;

  @Column({ type: 'smallint', unsigned: true })
  order: number;

  @Column({ type: 'smallint', unsigned: true })
  quantity: number;

  @Column({ type: 'varchar', precision: 255, nullable: true })
  quantityUnit?: string;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.ingredientToRecipe)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredientToRecipe)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
