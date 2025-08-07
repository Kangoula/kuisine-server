import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { IngredientToRecipe } from '../../ingredient-to-recipe/entities/ingredient-to-recipe.entity';
import { SoftDeletableEntity } from 'src/common/entities/soft-deletable.entity';

@Entity()
export class Ingredient extends SoftDeletableEntity {
  @Column({ type: 'varchar', precision: 255, unique: true })
  name: string;

  @OneToMany(
    () => IngredientToRecipe,
    (ingredientToRecipe) => ingredientToRecipe.ingredient,
  )
  ingredientToRecipe: IngredientToRecipe[];
}
