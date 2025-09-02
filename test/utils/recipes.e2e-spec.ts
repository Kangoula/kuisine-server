import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/entities/user.entity';
import { loginAs, loginAsGivenUser } from './auth.test-utils';
import { RecipesService } from '@/recipes/recipes.service';

describe('Recipes', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('unauthenticated', () => {
    it('/POST should fail with Unauthorized response', async () => {
      const response = await request(app.getHttpServer())
        .post('/recipes')
        .send({ name: 'durian' });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('authenticated as simple user', () => {
    // let bearerToken: string;
    let user: User;

    beforeAll(async () => {
      user = await app.get(UsersService).findByUsername('jabba');
    });

    // beforeEach(() => {
    //   bearerToken = loginAsGivenUser(app, user);
    // });

    it('/DELETE should not be allowed when not owner of the recipe', async () => {
      const recipeResponse = await request(app.getHttpServer())
        .post('/recipes')
        .set('Authorization', await loginAs(app, 'admin'))
        .send({
          name: 'recipe we want to try to delete',
          servings: 2,
          cookingDurationMinutes: 2,
          preparationDurationMinutes: 2,
        });

      const recipeId = recipeResponse?.body?.id;

      const response = await request(app.getHttpServer())
        .delete(`/recipes/${recipeId}`)
        .set('Authorization', loginAsGivenUser(app, user))
        .send();

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
