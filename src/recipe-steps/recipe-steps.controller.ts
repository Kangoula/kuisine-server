import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RecipeStepsService } from './recipe-steps.service';
import { CreateRecipeStepDto } from './dto/create-recipe_step.dto';
import { UpdateRecipeStepDto } from './dto/update-recipe_step.dto';

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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipeStepsService.findOneOrFail(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeStepDto: UpdateRecipeStepDto,
  ) {
    return this.recipeStepsService.update(id, updateRecipeStepDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.recipeStepsService.findOneOrFail(id);

    return this.recipeStepsService.remove(id);
  }
}
