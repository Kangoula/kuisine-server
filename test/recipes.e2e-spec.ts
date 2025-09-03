import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
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
    const payload = {
      name: 'recipe we want to create',
      servings: 2,
      cookingDurationMinutes: 2,
      preparationDurationMinutes: 2,
    };

    it('/POST should be allowed', async () => {
      const response = await request(app.getHttpServer())
        .post('/recipes')
        .set('Authorization', await loginAsAdmin(app))
        .send(payload);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('id', expect.any(Number));
      expect(response.body).toHaveProperty('name', payload.name);
    });

    it('/DELETE should fail when not owner', async () => {
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

    it('/DELETE owner should be allowed', async () => {
      const recipeResponse = await request(app.getHttpServer())
        .post('/recipes')
        .set('Authorization', await loginAsUser(app))
        .send({
          name: 'recipe to delete',
          servings: 2,
          cookingDurationMinutes: 2,
          preparationDurationMinutes: 2,
        });

      const recipeId = recipeResponse?.body?.id as number;

      const response = await request(app.getHttpServer())
        .delete(`/recipes/${recipeId}`)
        .set('Authorization', await loginAsUser(app))
        .send();

      expect(response.status).toBe(HttpStatus.OK);
    });

    it('/PATCH should fail when not owner', async () => {
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

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('id', recipeId);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
