import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';
import { BaseEntityService } from '@/common/base-entity.service';

@Injectable()
export class IngredientsService extends BaseEntityService(Ingredient) {
  async create(createIngredientDto: CreateIngredientDto) {
    const ingredient = new Ingredient();
    ingredient.name = createIngredientDto.name;

    await this.repository.insert(ingredient);
    return ingredient;
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
    const q = this.update(id, {
      fullTextSearch: () => "to_tsvector('french', name)",
    });

    return q;
  }
}
