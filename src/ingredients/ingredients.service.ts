import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';
import { BaseEntityService } from '@/common/base-entity.service';

@Injectable()
export class IngredientsService extends BaseEntityService(Ingredient) {
  create(createIngredientDto: CreateIngredientDto) {
    const ingredient = new Ingredient();
    ingredient.name = createIngredientDto.name;

    return this.repository.save(ingredient);
  }

  search(term: string) {
    const formattedTerm: string = term.trim().replace(/ /g, ' & ');

    return this.repository
      .createQueryBuilder('ingredient')
      .where(
        `to_tsvector('simple',ingredient.name) @@ to_tsquery('simple', :query)`,
        { query: `${formattedTerm}:*` },
      )
      .getMany();
  }
}
