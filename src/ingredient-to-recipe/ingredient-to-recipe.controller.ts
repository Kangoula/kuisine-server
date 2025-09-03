import { Body, Controller, Delete, Patch } from '@nestjs/common';
import { UpdateIngredientToRecipeDto } from './dto/update-ingredient-to-recipe.dto';
import { IngredientToRecipeService } from './ingredient-to-recipe.service';
import { EntityId } from '@/common/decorators/route-params.decorator';
import { Permission } from '@/casl/permission.decorator';
import { IngredientToRecipe } from './entities/ingredient-to-recipe.entity';
import { Action } from '@/casl/action.enum';
import { CookieTypeNames } from '@/auth/auth.service';
import { ApiCookieAuth } from '@nestjs/swagger';

@ApiCookieAuth(CookieTypeNames.Access)
@Controller('ingredient-to-recipe')
export class IngredientToRecipeController {
  constructor(
    private readonly ingredientToRecipeService: IngredientToRecipeService,
  ) {}

  @Patch(':id')
  @Permission(IngredientToRecipe, Action.Update)
  async update(
    @EntityId id: number,
    @Body() updateIngredientToRecipeDto: UpdateIngredientToRecipeDto,
  ) {
    return this.ingredientToRecipeService.update(
      id,
      updateIngredientToRecipeDto,
    );
  }

  @Delete(':id')
  @Permission(IngredientToRecipe, Action.Delete)
  async remove(@EntityId id: number) {
    await this.ingredientToRecipeService.findOne(id);
    return this.ingredientToRecipeService.remove(id);
  }
}
