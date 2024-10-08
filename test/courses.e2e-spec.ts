import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CoursesModule } from '../src/courses/courses.module';
import { CoursesService } from '../src/courses/courses.service';
import { Course } from '../src/courses/entities/course.entity';
import { AppModule } from '../src/app.module';
import { v4 as uuid } from 'uuid';

describe('CoursesController (e2e)', () => {
    let app: INestApplication;

    const courses = [
        {
            id: uuid(),
            name: 'Course A',
            users: uuid(),
        },
        {
            id: uuid(),
            name: 'Course B',
            users: uuid(),
        },
        {
            id: uuid(),
            name: 'Course C',
            users: uuid(),
        },
    ];

    const mockCourseService = {
        findAll: jest.fn(() => courses),
        findOne: jest.fn((id: string) => courses.find(course => course.id === id)),
        create: jest.fn((data: Course) => ({ id: '4', ...data })),
        update: jest.fn((id: string, data: Course) => ({ id, ...data })),
        remove: jest.fn((id: string) => ({})),
    };

    const mockJwtService = {
        sign: jest.fn(() => 'mocked-token'),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(CoursesService)
            .useValue(mockCourseService)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/courses (GET)', async () => {
        return request(app.getHttpServer())
            .get('/courses')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(courses);
            });
    });

    it('/courses (POST)', async () => {
        const newCourse = {
            id: uuid(),
            name: 'Course D',
            users: uuid(),
        };
        return request(app.getHttpServer())
            .post('/courses')
            .send(newCourse)
            .expect('Content-Type', /json/)
            .expect(201)
            .then((response) => {
                expect(response.body).toEqual({ id: '4', ...newCourse });
            });
    });

    it('/courses/:id (PATCH)', async () => {
        const userId = '1';
        const updatedCourse = {
            name: 'Updated',
        };
        return request(app.getHttpServer())
            .put(`/courses/${userId}`)
            .send(updatedCourse)
            .expect('Content-Type', /json/)
            .expect(404);
    });

    it('/courses/:id (DELETE)', async () => {
        const courseId = '1';
        return request(app.getHttpServer())
            .delete(`/courses/${courseId}`)
            .expect(200);
    });
});