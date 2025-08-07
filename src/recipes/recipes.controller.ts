import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { IngredientToRecipeService } from 'src/ingredient-to-recipe/ingredient-to-recipe.service';
import { CreateIngredientToRecipeDto } from 'src/ingredient-to-recipe/dto/create-ingredient-to-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly ingredientToRecipeService: IngredientToRecipeService,
  ) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.remove(id);
  }

  @Put(':id/ingredients')
  addIngredients(
    @Param('id', ParseIntPipe) id: number,
    @Body() createIngredientToRecipeDto: CreateIngredientToRecipeDto,
  ) {
    return this.ingredientToRecipeService.create(createIngredientToRecipeDto);
  }

  @Get(':id/ingredients')
  getIngredients(@Param('id', ParseIntPipe) id: number) {
    return this.ingredientToRecipeService.findByRecipeId(id);
  }
}
