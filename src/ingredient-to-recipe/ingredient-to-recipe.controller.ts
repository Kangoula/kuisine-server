import { Body, Controller, Delete, Patch } from '@nestjs/common';
import { UpdateIngredientToRecipeDto } from './dto/update-ingredient-to-recipe.dto';
import { IngredientToRecipeService } from './ingredient-to-recipe.service';
import { EntityId } from '@/common/decorators/route-params.decorator';

@Controller('ingredient-to-recipe')
export class IngredientToRecipeController {
  constructor(
    private readonly ingredientToRecipeService: IngredientToRecipeService,
  ) {}

  @Patch(':id')
  async update(
    @EntityId() id: number,
    @Body() updateIngredientToRecipeDto: UpdateIngredientToRecipeDto,
  ) {
    return this.ingredientToRecipeService.update(
      id,
      updateIngredientToRecipeDto,
    );
  }

  @Delete(':id')
  async remove(@EntityId() id: number) {
    await this.ingredientToRecipeService.findOne(id);
    return this.ingredientToRecipeService.remove(id);
  }
}
