import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CriteriaService } from '../src/criteria/criteria.service';
import { AuthService } from '../src/auth/auth.service';
import { Criteria } from '../src/criteria/entities/criteria.entity';
import { AppModule } from '../src/app.module';
import { v4 as uuid } from 'uuid';
import { LoginUserDto } from '../src/auth/dto/login-user.dto';
import { RubricService } from '../src/rubric/rubric.service';

describe('CriteriaController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  const users = [
    {
      id: uuid(),
      email: 'diegomueses@gmail.com',
      password: 'diego1234',
      name: 'Diego Mueses',
      last_name: 'Mueses',
      user_code: 'USER001',
      role: 'student',
    },
    {
      id: uuid(),
      email: 'testuser2@gmail.com',
      password: '123456',
      name: 'User B',
      last_name: 'User B',
      user_code: 'USER002',
      role: 'teacher',
    },
    {
      id: uuid(),
      email: 'testuser3@gmail.com',
      password: '123456',
      name: 'User C',
      last_name: 'User C',
      user_code: 'USER003',
      role: 'student',
    },
  ];

  const rubrics = [
    {
      id: uuid(),
      name: 'Rubric 1',
    },
  ];

  const criteria = [
    {
      id: uuid(),
      rubric: rubrics[0],
      name: 'Criteria 1',
      description: 'Description for Criteria 1',
    },
    {
      id: uuid(),
      rubric: rubrics[0],
      name: 'Criteria 2',
      description: 'Description for Criteria 2',
    },
  ];

  const mockCriteriaService = {
    findAll: jest.fn(() => criteria),
    findOne: jest.fn((id: string) => criteria.find((criterion) => criterion.id === id)),
    create: jest.fn((data: Criteria) => ({ id: '3', ...data })),
    update: jest.fn((id: string, data: Criteria) => ({ id, ...data })),
    remove: jest.fn((id: string) => ({})),
  };

  const mockRubricService = {
    findOne: jest.fn(() => rubrics[0]),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CriteriaService)
      .useValue(mockCriteriaService)
      .overrideProvider(RubricService)
      .useValue(mockRubricService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 70 * 1000);

  it('/auth/login (POST)', async () => {
    const loginDto: LoginUserDto = {
      email: 'diegomueses@gmail.com',
      password: 'diego1234',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body.token).toBeDefined();
    accessToken = response.body.token;
  });

  it('/criteria (GET)', async () => {
    return request(app.getHttpServer())
      .get('/criteria')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(criteria);
      });
  });

  it('/criteria (POST)', async () => {
    const newCriteria = {
      rubric: rubrics[0].id,
      name: 'New Criteria',
      description: 'Description for new criteria',
    };
    return request(app.getHttpServer())
      .post('/criteria')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newCriteria)
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({ id: '3', ...newCriteria });
      });
  });

  it('/criteria/:id (PATCH)', async () => {
    const criteriaId = criteria[0].id;
    const updatedCriteria = {
      name: 'Updated Criteria Name',
    };
    return request(app.getHttpServer())
      .patch(`/criteria/${criteriaId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updatedCriteria)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.name).toEqual(updatedCriteria.name);
      });
  });

  it('/criteria/:id (DELETE)', async () => {
    const criteriaId = criteria[0].id;
    return request(app.getHttpServer())
      .delete(`/criteria/${criteriaId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
