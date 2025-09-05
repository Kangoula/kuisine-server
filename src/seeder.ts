import { seeder } from 'nestjs-seeder';
import { DatabaseModule } from './database/database.module';
import { UsersSeeder } from './users/user.seeder';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from './config/config.module';
import { RecipesSeeder } from './recipes/recipe.seeder';
import { RecipesModule } from './recipes/recipes.module';

seeder({
  imports: [
    ConfigModule,
    DatabaseModule,
    UsersModule,
    RolesModule,
    RecipesModule,
  ],
}).run([UsersSeeder, RecipesSeeder]);
