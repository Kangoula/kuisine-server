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

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.recipesService.paginate(paginationDto);
  }

  @Get(':id')
  findOne(@EntityId() id: number) {
    return this.recipesService.findOne(id);
  }

  @Patch(':id')
  update(@EntityId() id: number, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  async remove(@EntityId() id: number) {
    await this.recipesService.findOne(id);
    return this.recipesService.remove(id);
  }
}
