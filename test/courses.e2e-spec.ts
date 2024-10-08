import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { v4 as uuid } from 'uuid';
import { LoginUserDto } from '../src/auth/dto/login-user.dto';
import { CoursesService } from '../src/courses/courses.service';

describe('CoursesController (e2e)', () => {
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
    ];

    const courses = [
        {
            id: uuid(),
            name: 'Course 1',
            description: 'Description of Course 1',
            users: users[0],
        },
        {
            id: uuid(),
            name: 'Course 2',
            description: 'Description of Course 2',
            users: users[1],
        },
    ];

    const mockCoursesService = {
        findAll: jest.fn(() => courses),
        findOne: jest.fn((id: string) => courses.find(course => course.id === id)),
        create: jest.fn((data) => ({ id: uuid(), ...data })),
        update: jest.fn((id: string, data) => ({ id, ...data })),
        remove: jest.fn((id: string) => ({})),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(CoursesService)
            .useValue(mockCoursesService)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/auth/login (POST)', async () => {
        const loginDto: LoginUserDto = {
            email: 'diegomueses@gmail.com',
            password: 'diego1234',
        };

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .expect(201);

        expect(response.body.token).toBeDefined();
        accessToken = response.body.token;
    });

    it('/courses (GET)', async () => {
        return request(app.getHttpServer())
            .get('/courses')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(courses);
            });
    });

    it('/courses (POST)', async () => {
        const newCourse = {
            name: 'New Course',
            description: 'New course description',
            users: users[0].id,
        };

        return request(app.getHttpServer())
            .post('/courses')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(newCourse)
            .expect(201)
            .then((response) => {
                expect(response.body).toEqual({ id: expect.any(String), ...newCourse });
            });
    });

    it('/courses/:id (PATCH)', async () => {
        const courseId = courses[0].id;
        const updatedCourse = { name: 'Updated Course Name' };

        return request(app.getHttpServer())
            .patch(`/courses/${courseId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updatedCourse)
            .expect(200)
            .then((response) => {
                expect(response.body.name).toBe(updatedCourse.name);
            });
    });

    it('/courses/:id (DELETE)', async () => {
        const courseId = courses[0].id;

        return request(app.getHttpServer())
            .delete(`/courses/${courseId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
    });
});
