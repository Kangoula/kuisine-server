import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';
import { BaseEntityService } from '@/common/mixins/base-entity-service.mixin';

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
      .where(`ingredient.full_text_search @@ to_tsquery('french', :query)`, {
        query: `${formattedTerm}:*`,
      })
      .getMany();
  }

  updateFullTextSearch(id: number) {
    return this.update(id, {
      fullTextSearch: () => "to_tsvector('french', name)",
    });
  }
}
