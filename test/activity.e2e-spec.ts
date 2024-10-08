import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ActivityService } from '../src/activity/activity.service';
import { AuthService } from '../src/auth/auth.service';
import { Activity } from '../src/activity/entities/activity.entity';
import { AppModule } from '../src/app.module';
import { v4 as uuid } from 'uuid';
import { LoginUserDto } from '../src/auth/dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('ActivitiesController (e2e)', () => {
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

    const activities = [
        {
            id: uuid(),
            course: '1',
            name: 'Tarea Integradora 1',
            description: 'Se debe de hacer un juego de carreras',
        },
        {
            id: uuid(),
            course: '1',
            name: 'Tarea Integradora 2',
            description: 'Se debe de hacer un juego de pelea',
        },
        {
            id: uuid(),
            course: '1',
            name: 'Tarea Integradora 3',
            description: 'Se debe de hacer un juego de supervivencia',
        },
    ];

    const mockActivityService = {
        findAll: jest.fn(() => activities),
        findOne: jest.fn((id: string) => activities.find(activity => activity.id === id)),
        create: jest.fn((data: Activity) => ({ id: '4', ...data })),
        update: jest.fn((id: string, data: Activity) => ({ id, ...data })),
        remove: jest.fn((id: string) => ({})),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(ActivityService)
            .useValue(mockActivityService)
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

    it('/activities (GET)', async () => {
        return request(app.getHttpServer())
            .get('/activities')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(activities);
            });
    });

    it('/activities (POST)', async () => {
        const newActivity = {
            course: '1',
            name: 'Taller de nest js',
            description: 'Hacer muchisimos test',
        };
        return request(app.getHttpServer())
            .post('/activities')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(newActivity)
            .expect('Content-Type', /json/)
            .expect(201)
            .then((response) => {
                expect(response.body).toEqual({ id: '4', ...newActivity });
            });
    });

    it('/activities/:id (PATCH)', async () => {
        const activityId = '1';
        const updatedActivity = {
            name: 'Updated',
        };
        return request(app.getHttpServer())
            .patch(`/activities/${activityId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updatedActivity)
            .expect('Content-Type', /json/)
            .expect(200);
    });

    it('/activities/:id (DELETE)', async () => {
        const activityId = '1';
        return request(app.getHttpServer())
            .delete(`/activities/${activityId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
    });
});
