import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { EntityId } from '@/common/decorators/route-params.decorator';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto);
  }

  @Get()
  findAll() {
    return this.ingredientsService.findAll();
  }

  @Get(':id')
  findOne(@EntityId() id: number) {
    return this.ingredientsService.findOneOrFail(id);
  }

  @Patch(':id')
  update(
    @EntityId() id: number,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientsService.update(+id, updateIngredientDto);
  }

  @Delete(':id')
  async remove(@EntityId() id: number) {
    await this.ingredientsService.findOneOrFail(id);
    return this.ingredientsService.remove(id);
  }
}
