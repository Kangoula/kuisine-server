import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { RecipeStepsService } from './recipe-steps.service';
import { CreateRecipeStepDto } from './dto/create-recipe-step.dto';
import { UpdateRecipeStepDto } from './dto/update-recipe-step.dto';
import { EntityId } from '@/common/decorators';
import { Permission } from '@/casl/permission.decorator';
import { RecipeStep } from './entities/recipe-step.entity';
import { Action } from '@/casl/action.enum';
import { ApiCookieAuth } from '@nestjs/swagger';
import { CookieTypeNames } from '@/auth/auth.service';

@ApiCookieAuth(CookieTypeNames.Access)
@Controller('recipe-steps')
export class RecipeStepsController {
  constructor(private readonly recipeStepsService: RecipeStepsService) {}

  @Post()
  @Permission(RecipeStep, Action.Create)
  create(@Body() createRecipeStepDto: CreateRecipeStepDto) {
    return this.recipeStepsService.create(createRecipeStepDto);
  }

  @Get(':id')
  @Permission(RecipeStep, Action.Read)
  findOne(@EntityId id: number) {
    return this.recipeStepsService.findOne(id);
  }

  @Patch(':id')
  @Permission(RecipeStep, Action.Update)
  update(
    @EntityId id: number,
    @Body() updateRecipeStepDto: UpdateRecipeStepDto,
  ) {
    return this.recipeStepsService.update(id, updateRecipeStepDto);
  }

  @Delete(':id')
  @Permission(RecipeStep, Action.Delete)
  async remove(@EntityId id: number) {
    await this.recipeStepsService.findOne(id);

    return this.recipeStepsService.remove(id);
  }
}
