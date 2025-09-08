import { seeder } from 'nestjs-seeder';
import { DatabaseModule } from './database/database.module';
import { UsersSeeder } from './users/user.seeder';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from './config/config.module';
import { RecipesSeeder } from './recipes/recipe.seeder';
import { RecipesModule } from './recipes/recipes.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { IngredientsSeeder } from './ingredients/ingredient.seeder';
import { RecipeStepsSeeder } from './recipe-steps/recipe-steps.seeder';
import { RecipeStepsModule } from './recipe-steps/recipe-steps.module';
import { IngredientToRecipeSeeder } from './ingredient-to-recipe/ingredient-to-recipe.seeder';
import { IngredientToRecipeModule } from './ingredient-to-recipe/ingredient-to-recipe.module';

seeder({
  imports: [
    ConfigModule,
    DatabaseModule,
    UsersModule,
    RolesModule,
    IngredientsModule,
    RecipesModule,
    RecipeStepsModule,
    IngredientToRecipeModule,
  ],
}).run([
  UsersSeeder,
  IngredientsSeeder,
  RecipesSeeder,
  RecipeStepsSeeder,
  IngredientToRecipeSeeder,
]);
