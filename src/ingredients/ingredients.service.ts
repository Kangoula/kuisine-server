import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { Repository } from 'typeorm';
import { BaseEntityService } from 'src/common/base-entity.service';

@Injectable()
export class IngredientsService extends BaseEntityService(Ingredient) {
  create(createIngredientDto: CreateIngredientDto) {
    const ingredient = new Ingredient();
    ingredient.name = createIngredientDto.name;

    return this.repository.save(ingredient);
  }
}
