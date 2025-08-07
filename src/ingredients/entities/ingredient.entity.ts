import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IngredientToRecipe } from '../../ingredient-to-recipe/entities/ingredient-to-recipe.entity';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', precision: 255 })
  name: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @OneToMany(
    () => IngredientToRecipe,
    (ingredientToRecipe) => ingredientToRecipe.ingredient,
  )
  ingredientToRecipe: IngredientToRecipe[];
}
