import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RubricService } from '../src/rubric/rubric.service';
import { AuthService } from '../src/auth/auth.service';
import { AppModule } from '../src/app.module';
import { v4 as uuid } from 'uuid';
import { LoginUserDto } from '../src/auth/dto/login-user.dto';
import { use } from 'passport';

describe('RubricController (e2e)', () => {
  let app: INestApplication;
  let teacherAccessToken: string;
  let studentAccessToken: string;

  const users = [
    {
        email: 'diegomueses@gmail.com',
        password: 'diego1234',
    },
    {
        email: 'johanDiaz23@gmail.com',
        password: 'contrasena123'
    },
];

  const rubrics = [
    {
      id: uuid(),
      name: 'Rubric 1',
      description: 'Evaluation rubric 1',
    },
    {
      id: uuid(),
      name: 'Rubric 2',
      description: 'Evaluation rubric 2',
    },
  ];

  const mockRubricService = {
    findAll: jest.fn(() => rubrics),
    findOne: jest.fn((id: string) => rubrics.find((rubric) => rubric.id === id)),
    create: jest.fn((data) => ({ id: uuid(), ...data })),
    update: jest.fn((id: string, data) => ({ id, ...data })),
    remove: jest.fn((id: string) => ({})),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RubricService)
      .useValue(mockRubricService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 70 * 1000);

  afterAll(async () => {
    await app.close();
  });

  it('should login as teacher', async () => {
    const loginDto: LoginUserDto = {
      email: users[0].email,
      password: users[0].password,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body.token).toBeDefined();
    teacherAccessToken = response.body.token;
  });

  it('should login as student', async () => {
    const loginDto: LoginUserDto = {
      email: users[1].email,
      password: users[1].password,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body.token).toBeDefined();
    studentAccessToken = response.body.token;
  });

  describe('GET /rubric', () => {
    it('should allow teacher to get all rubrics', async () => {
      return request(app.getHttpServer())
        .get('/rubric')
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(rubrics);
        });
    });

    it('should allow student to get all rubrics', async () => {
      return request(app.getHttpServer())
        .get('/rubric')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(rubrics);
        });
    });
  });

  describe('GET /rubric/:id', () => {
    it('should allow teacher to get a specific rubric', async () => {
      const rubricId = rubrics[0].id;
      return request(app.getHttpServer())
        .get(`/rubric/${rubricId}`)
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(rubrics[0]);
        });
    });

    it('should allow student to get a specific rubric', async () => {
      const rubricId = rubrics[0].id;
      return request(app.getHttpServer())
        .get(`/rubric/${rubricId}`)
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(rubrics[0]);
        });
    });
  });

  describe('POST /rubric', () => {
    it('should allow teacher to create a new rubric', async () => {
      const newRubric = {
        name: 'New Rubric',
        description: 'New evaluation rubric',
      };
      return request(app.getHttpServer())
        .post('/rubric')
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .send(newRubric)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          expect(response.body.id).toBeDefined();
          expect(response.body.name).toEqual(newRubric.name);
          expect(response.body.description).toEqual(newRubric.description);
        });
    });

    it('should not allow student to create a new rubric', async () => {
      const newRubric = {
        name: 'New Rubric',
        description: 'New evaluation rubric',
      };
      return request(app.getHttpServer())
        .post('/rubric')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .send(newRubric)
        .expect(403);
    });
  });

  describe('PATCH /rubric/:id', () => {
    it('should allow teacher to update a rubric', async () => {
      const rubricId = rubrics[0].id;
      const updatedRubric = {
        name: 'Updated Rubric',
      };
      return request(app.getHttpServer())
        .patch(`/rubric/${rubricId}`)
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .send(updatedRubric)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toEqual(rubricId);
          expect(response.body.name).toEqual(updatedRubric.name);
        });
    });

    it('should not allow student to update a rubric', async () => {
      const rubricId = rubrics[0].id;
      const updatedRubric = {
        name: 'Updated Rubric',
      };
      return request(app.getHttpServer())
        .patch(`/rubric/${rubricId}`)
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .send(updatedRubric)
        .expect(403);
    });
  });

  describe('DELETE /rubric/:id', () => {
    it('should allow teacher to delete a rubric', async () => {
      const rubricId = rubrics[0].id;
      return request(app.getHttpServer())
        .delete(`/rubric/${rubricId}`)
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .expect(200);
    });

    it('should not allow student to delete a rubric', async () => {
      const rubricId = rubrics[0].id;
      return request(app.getHttpServer())
        .delete(`/rubric/${rubricId}`)
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect(403);
    });
  });
});