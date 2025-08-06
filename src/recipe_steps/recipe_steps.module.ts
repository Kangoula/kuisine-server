import { Module } from '@nestjs/common';
import { RecipeStepsService } from './recipe_steps.service';
import { RecipeStepsController } from './recipe_steps.controller';
import { RecipeStep } from './entities/recipe_step.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeStep])],
  controllers: [RecipeStepsController],
  providers: [RecipeStepsService],
})
export class RecipeStepsModule {}
