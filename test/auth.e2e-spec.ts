import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { print } from 'graphql';
import {
  Token,
  getProfile,
  loginMutation,
  registerMutation,
} from './graphql/mockQuery';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('should be authenticated', () => {
    it.skip('should be create a new user successful', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: print(registerMutation),
        })
        .expect((res) => {
          expect(res.body.data.register.user).toBeDefined();
        });
    });

    it('should be throw an error that user alreay exist', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: print(registerMutation),
        })
        .expect((res) => {
          expect(res.body.errors[0].code).toEqual('INTERNAL_SERVER_ERROR');
        });
    });

    it('should login successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: print(loginMutation),
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.login).toBeDefined();
        });
    });

    it('should throw error when query profile without token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: print(getProfile),
        })
        .expect((res) => {
          expect(res.body.errors[0].code).toEqual('UNAUTHENTICATED');
        });
    });

    it('should query user profile success based on the token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Accept', 'application/json')
        .set('Authorization', Token)
        .send({
          query: print(getProfile),
        })
        .expect((res) => {
          expect(res.body.profile).toBeDefined();
        });
    });
  });
});
