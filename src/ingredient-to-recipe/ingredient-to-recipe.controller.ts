import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { UpdateIngredientToRecipeDto } from './dto/update-ingredient-to-recipe.dto';
import { IngredientToRecipeService } from './ingredient-to-recipe.service';

@Controller('ingredient-to-recipe')
export class IngredientToRecipeController {
  constructor(
    private readonly ingredientToRecipeService: IngredientToRecipeService,
  ) {}

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIngredientToRecipeDto: UpdateIngredientToRecipeDto,
  ) {
    return this.ingredientToRecipeService.update(
      id,
      updateIngredientToRecipeDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.ingredientToRecipeService.findOneOrFail(id);
    return this.ingredientToRecipeService.remove(id);
  }
}
