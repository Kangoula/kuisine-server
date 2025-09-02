import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PaginationDto } from '@/common/pagination/dto/pagination.dto';
import { EntityId } from '@/common/decorators/route-params.decorator';
import { Permission } from '@/casl/permission.decorator';
import { Recipe } from './entities/recipe.entity';
import { Action } from '@/casl/action.enum';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @Permission(Recipe, Action.Create)
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  @Permission(Recipe, Action.Read)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.recipesService.paginate(paginationDto);
  }

  @Get(':id')
  @Permission(Recipe, Action.Read)
  findOne(@EntityId() id: number) {
    return this.recipesService.findOne(id);
  }

  @Patch(':id')
  @Permission(Recipe, Action.Update)
  update(@EntityId() id: number, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  @Permission(Recipe, Action.Delete)
  async remove(@EntityId() id: number) {
    await this.recipesService.findOne(id);
    return this.recipesService.remove(id);
  }
}
