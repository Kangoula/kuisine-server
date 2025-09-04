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
import { EntityId } from '@/common/decorators';
import { PaginationDto } from '@/common/pagination';
import { Permission } from '@/casl/permission.decorator';
import { Ingredient } from './entities/ingredient.entity';
import { Action } from '@/casl/action.enum';
import { ApiCookieAuth } from '@nestjs/swagger';
import { CookieTypeNames } from '@/auth/auth.service';

@ApiCookieAuth(CookieTypeNames.Access)
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  @Permission(Ingredient, Action.Create)
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto);
  }

  @Get()
  @Permission(Ingredient, Action.Read)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ingredientsService.paginate(paginationDto);
  }

  @Get('search')
  @Permission(Ingredient, Action.Read)
  search(@Query('term') term: string) {
    return this.ingredientsService.search(term);
  }

  @Get(':id')
  @Permission(Ingredient, Action.Read)
  findOne(@EntityId id: number) {
    return this.ingredientsService.findOne(id);
  }

  @Patch(':id')
  @Permission(Ingredient, Action.Update)
  update(
    @EntityId id: number,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientsService.update(+id, updateIngredientDto);
  }

  @Delete(':id')
  @Permission(Ingredient, Action.Delete)
  async remove(@EntityId id: number) {
    await this.ingredientsService.findOne(id);
    return this.ingredientsService.remove(id);
  }
}
