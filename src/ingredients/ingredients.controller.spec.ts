import { Test, TestingModule } from '@nestjs/testing';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import typeormConfig from '@/config/typeorm-test.config';
import { DataSource } from 'typeorm';
import { IngredientToRecipe } from '@/ingredient-to-recipe/entities/ingredient-to-recipe.entity';

describe('IngredientsController', () => {
  let dataSource: DataSource;
  let controller: IngredientsController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...typeormConfig,
          migrationsRun: true,
          entities: [Ingredient, IngredientToRecipe],
        }),
        TypeOrmModule.forFeature([Ingredient, IngredientToRecipe]),
      ],
      controllers: [IngredientsController],
      providers: [IngredientsService],
    }).compile();

    dataSource = module.get<DataSource>(getDataSourceToken());
    controller = module.get<IngredientsController>(IngredientsController);
  });

  afterAll(async () => {
    await dataSource?.destroy();
  });

  beforeEach(async () => {
    // TRUNCATE toutes les tables du schéma public pour repartir propre
    // (ajuste si tu as plusieurs schémas)
    const tables = await dataSource.query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
    `);
    for (const { tablename } of tables) {
      await dataSource.query(
        `TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`,
      );
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
