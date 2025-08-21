import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { RecipeStepsService } from './recipe-steps.service';
import { CreateRecipeStepDto } from './dto/create-recipe_step.dto';
import { UpdateRecipeStepDto } from './dto/update-recipe_step.dto';
import { EntityId } from '@/common/decorators/route-params.decorator';

@Controller('recipe-steps')
export class RecipeStepsController {
  constructor(private readonly recipeStepsService: RecipeStepsService) {}

  @Post()
  create(@Body() createRecipeStepDto: CreateRecipeStepDto) {
    return this.recipeStepsService.create(createRecipeStepDto);
  }

  @Get()
  findAll() {
    return this.recipeStepsService.findAll();
  }

  @Get(':id')
  findOne(@EntityId() id: number) {
    return this.recipeStepsService.findOneOrFail(id);
  }

  @Patch(':id')
  update(
    @EntityId() id: number,
    @Body() updateRecipeStepDto: UpdateRecipeStepDto,
  ) {
    return this.recipeStepsService.update(id, updateRecipeStepDto);
  }

  @Delete(':id')
  async remove(@EntityId() id: number) {
    await this.recipeStepsService.findOneOrFail(id);

    return this.recipeStepsService.remove(id);
  }
}
