import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/entities/user.entity';
import { loginAsAdmin, loginAsUser } from './utils/auth.test-utils';

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
    it('/DELETE should not be allowed when not owner of the recipe', async () => {
      const recipeResponse = await request(app.getHttpServer())
        .post('/recipes')
        .set('Authorization', await loginAsAdmin(app))
        .send({
          name: 'recipe we want to try to delete',
          servings: 2,
          cookingDurationMinutes: 2,
          preparationDurationMinutes: 2,
        });

      const recipeId = recipeResponse?.body?.id as number;

      const response = await request(app.getHttpServer())
        .delete(`/recipes/${recipeId}`)
        .set('Authorization', await loginAsUser(app))
        .send();

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('/PATCH should not be allowed when not owner of the recipe', async () => {
      const recipeResponse = await request(app.getHttpServer())
        .post('/recipes')
        .set('Authorization', await loginAsAdmin(app))
        .send({
          name: 'recipe we want to try to update',
          servings: 2,
          cookingDurationMinutes: 2,
          preparationDurationMinutes: 2,
        });

      const recipeId = recipeResponse?.body?.id as number;

      const response = await request(app.getHttpServer())
        .patch(`/recipes/${recipeId}`)
        .set('Authorization', await loginAsUser(app))
        .send({
          name: 'updated name',
        });

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('/GET/:id should be allowed', async () => {
      const recipeResponse = await request(app.getHttpServer())
        .post('/recipes')
        .set('Authorization', await loginAsAdmin(app))
        .send({
          name: 'recipe we want to get',
          servings: 2,
          cookingDurationMinutes: 2,
          preparationDurationMinutes: 2,
        });

      const recipeId = recipeResponse?.body?.id as number;

      const response = await request(app.getHttpServer())
        .get(`/recipes/${recipeId}`)
        .set('Authorization', await loginAsUser(app))
        .send();

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
      expect(response.body.id).toBe(recipeId);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
