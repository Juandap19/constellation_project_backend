import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ActivityModule } from '../src/activity/activity.module';
import { ActivityService } from '../src/activity/activity.service';
import { Activity } from '../src/activity/entities/activity.entity';
import { AppModule } from '../src/app.module';
import { v4 as uuid } from 'uuid';

describe('ActivitiessController (e2e)', () => {
    let app: INestApplication;

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

    const mockJwtService = {
        sign: jest.fn(() => 'mocked-token'),
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
    });

    it('/activities (GET)', async () => {
        return request(app.getHttpServer())
            .get('/activities')
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
            .put(`/activities/${activityId}`)
            .send(updatedActivity)
            .expect('Content-Type', /json/)
            .expect(404);
    });

    it('/activities/:id (DELETE)', async () => {
        const activityId = '1';
        return request(app.getHttpServer())
            .delete(`/activities/${activityId}`)
            .expect(200);
    });
});