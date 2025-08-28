import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { EntityId } from '@/common/decorators/route-params.decorator';
import { PaginationDto } from '@/common/pagination';
import { Can } from '@/casl/check-abilities.decorator';
import { Ingredient } from './entities/ingredient.entity';
import { Action } from '@/casl/action.enum';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  @Can({ subject: Ingredient, action: Action.Create })
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ingredientsService.paginate(paginationDto);
  }

  @Get('search')
  search(@Query('term') term: string) {
    return this.ingredientsService.search(term);
  }

  @Get(':id')
  findOne(@EntityId() id: number) {
    return this.ingredientsService.findOne(id);
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
    await this.ingredientsService.findOne(id);
    return this.ingredientsService.remove(id);
  }
}
