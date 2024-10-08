import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ScheduleService } from '../src/schedule/schedule.service';
import { AuthService } from '../src/auth/auth.service';
import { AppModule } from '../src/app.module';
import { v4 as uuid } from 'uuid';
import { LoginUserDto } from '../src/auth/dto/login-user.dto';
import { use } from 'passport';

describe('ScheduleController (e2e)', () => {
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

  const schedules = [
    {
      id: uuid(),
      title: 'Math Class',
      start_time: '2023-06-01T09:00:00Z',
      end_time: '2023-06-01T10:30:00Z',
      description: 'Advanced Algebra',
    },
    {
      id: uuid(),
      title: 'Physics Lab',
      start_time: '2023-06-02T14:00:00Z',
      end_time: '2023-06-02T16:00:00Z',
      description: 'Experimental Physics',
    },
  ];

  const mockScheduleService = {
    findAll: jest.fn(() => schedules),
    findOne: jest.fn((id: string) => schedules.find((schedule) => schedule.id === id)),
    create: jest.fn((data) => ({ id: uuid(), ...data })),
    update: jest.fn((id: string, data) => ({ id, ...data })),
    remove: jest.fn((id: string) => ({})),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ScheduleService)
      .useValue(mockScheduleService)
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

  describe('GET /schedule', () => {
    it('should allow teacher to get all schedules', async () => {
      return request(app.getHttpServer())
        .get('/schedule')
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(schedules);
        });
    });

    it('should allow student to get all schedules', async () => {
      return request(app.getHttpServer())
        .get('/schedule')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(schedules);
        });
    });
  });

  describe('GET /schedule/:id', () => {
    it('should allow teacher to get a specific schedule', async () => {
      const scheduleId = schedules[0].id;
      return request(app.getHttpServer())
        .get(`/schedule/${scheduleId}`)
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(schedules[0]);
        });
    });

    it('should allow student to get a specific schedule', async () => {
      const scheduleId = schedules[0].id;
      return request(app.getHttpServer())
        .get(`/schedule/${scheduleId}`)
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(schedules[0]);
        });
    });
  });

  describe('POST /schedule', () => {
    it('should allow teacher to create a new schedule', async () => {
      const newSchedule = {
        title: 'Chemistry Class',
        start_time: '2023-06-03T11:00:00Z',
        end_time: '2023-06-03T12:30:00Z',
        description: 'Organic Chemistry',
      };
      return request(app.getHttpServer())
        .post('/schedule')
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .send(newSchedule)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          expect(response.body.id).toBeDefined();
          expect(response.body.title).toEqual(newSchedule.title);
          expect(response.body.start_time).toEqual(newSchedule.start_time);
          expect(response.body.end_time).toEqual(newSchedule.end_time);
          expect(response.body.description).toEqual(newSchedule.description);
        });
    });

    it('should allow student to create a new schedule', async () => {
      const newSchedule = {
        title: 'Study Group',
        start_time: '2023-06-04T15:00:00Z',
        end_time: '2023-06-04T17:00:00Z',
        description: 'Group study for final exams',
      };
      return request(app.getHttpServer())
        .post('/schedule')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .send(newSchedule)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          expect(response.body.id).toBeDefined();
          expect(response.body.title).toEqual(newSchedule.title);
          expect(response.body.start_time).toEqual(newSchedule.start_time);
          expect(response.body.end_time).toEqual(newSchedule.end_time);
          expect(response.body.description).toEqual(newSchedule.description);
        });
    });
  });

  describe('PATCH /schedule/:id', () => {
    it('should allow teacher to update a schedule', async () => {
      const scheduleId = schedules[0].id;
      const updatedSchedule = {
        title: 'Updated Math Class',
        description: 'Updated Advanced Algebra',
      };
      return request(app.getHttpServer())
        .patch(`/schedule/${scheduleId}`)
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .send(updatedSchedule)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toEqual(scheduleId);
          expect(response.body.title).toEqual(updatedSchedule.title);
          expect(response.body.description).toEqual(updatedSchedule.description);
        });
    });

    it('should allow student to update a schedule', async () => {
      const scheduleId = schedules[1].id;
      const updatedSchedule = {
        title: 'Updated Physics Lab',
        description: 'Updated Experimental Physics',
      };
      return request(app.getHttpServer())
        .patch(`/schedule/${scheduleId}`)
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .send(updatedSchedule)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toEqual(scheduleId);
          expect(response.body.title).toEqual(updatedSchedule.title);
          expect(response.body.description).toEqual(updatedSchedule.description);
        });
    });
  });

  describe('DELETE /schedule/:id', () => {
    it('should allow teacher to delete a schedule', async () => {
      const scheduleId = schedules[0].id;
      return request(app.getHttpServer())
        .delete(`/schedule/${scheduleId}`)
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .expect(200);
    });

    it('should allow student to delete a schedule', async () => {
      const scheduleId = schedules[1].id;
      return request(app.getHttpServer())
        .delete(`/schedule/${scheduleId}`)
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect(200);
    });
  });
});