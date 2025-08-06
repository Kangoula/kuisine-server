import { Recipe } from 'src/recipes/entities/recipe.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RecipeStep {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @Column('text')
  description: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Recipe, (recipe) => recipe.steps)
  recipe: Recipe;
}
