import { Module } from '@nestjs/common';
import { RecipeStepsService } from './recipe_steps.service';
import { RecipeStepsController } from './recipe_steps.controller';
import { RecipeStep } from './entities/recipe_step.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesModule } from 'src/recipes/recipes.module';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeStep]), RecipesModule],
  controllers: [RecipeStepsController],
  providers: [RecipeStepsService],
})
export class RecipeStepsModule {}
