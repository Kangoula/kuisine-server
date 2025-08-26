import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { loginAs } from './utils/auth.test-utils';
import { IngredientsService } from '@/ingredients/ingredients.service';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

describe('Ingredients', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('/POST ingredients', () => {
    describe('unauthenticated', () => {
      it('should fail with Unauthorized response', async () => {
        const response = await request(app.getHttpServer())
          .post('/ingredients')
          .send({ name: 'durian' });

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    describe('authenticated', () => {
      let bearerToken: string;

      beforeEach(async () => {
        bearerToken = await loginAs(app, 'admin');
      });

      it('with correct payload should return the created ingredient with Created response', async () => {
        const response = await request(app.getHttpServer())
          .post('/ingredients')
          .set('Authorization', bearerToken)
          .send({ name: 'durian' });

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body).toHaveProperty('id', expect.any(Number));
        expect(response.body).toHaveProperty('name', 'durian');
        expect(response.body).not.toHaveProperty('deletedAt');
        expect(response.body).not.toHaveProperty('fullTextSeach');
      });

      it('with incorrect payload should fail with Bad Request response', async () => {
        const response = await request(app.getHttpServer())
          .post('/ingredients')
          .set('Authorization', bearerToken)
          .send({ name: '' });

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should return expected ingredient in fulltext search', async () => {
        const ingredientService = app.get(IngredientsService);
        const expectedName = 'tomate';

        await ingredientService.create({
          name: expectedName,
        });

        const response = await request(app.getHttpServer())
          .get('/ingredients/search')
          .query({ term: 'tom' })
          .set('Authorization', bearerToken);

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body[0]).toBeDefined();
        expect(response.body[0].name).toBe(expectedName);
      });

      it('should not return anything in fulltext search', async () => {
        const response = await request(app.getHttpServer())
          .get('/ingredients/search')
          .query({ term: 'xb2212' })
          .set('Authorization', bearerToken);

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toHaveLength(0);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
