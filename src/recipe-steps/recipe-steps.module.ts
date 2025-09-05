import { Module } from '@nestjs/common';
import { RecipeStepsService } from './recipe-steps.service';
import { RecipeStepsController } from './recipe-steps.controller';
import { RecipeStep } from './entities/recipe-step.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesModule } from '@/recipes/recipes.module';
import { RecipeStepsSeeder } from './recipe-steps.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeStep]), RecipesModule],
  controllers: [RecipeStepsController],
  providers: [RecipeStepsService, RecipeStepsSeeder],
  exports: [RecipeStepsSeeder, RecipeStepsService],
})
export class RecipeStepsModule {}
