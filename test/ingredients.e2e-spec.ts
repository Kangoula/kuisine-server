import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';

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
    it('without being authenticated should fail with Unauthorized response', async () => {
      const response = await request(app.getHttpServer())
        .post('/ingredients')
        .send({ name: 'durian' });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('with correct payload should return the created ingradient with Created response', async () => {
      const response = await request(app.getHttpServer())
        .post('/ingredients')
        .send({ name: 'durian' });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'durian');
      expect(response.body).not.toHaveProperty('deletedAt');
      expect(response.body).not.toHaveProperty('fullTextSeach');
    });

    it('with incorrect payload should fail with Bad Request response', async () => {
      const response = await request(app.getHttpServer())
        .post('/ingredients')
        .send({ name: '' });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
