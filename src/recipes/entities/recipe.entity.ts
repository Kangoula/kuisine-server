import { RecipeStep } from 'src/recipe_steps/entities/recipe_step.entity';
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

  @Column()
  name: string;

  @Column()
  servings: number;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @OneToMany(() => RecipeStep, (recipeStep) => recipeStep.recipe, {
    cascade: true,
  })
  steps: RecipeStep[];
}
