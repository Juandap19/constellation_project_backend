import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';
import { Users } from '../src/auth/entities/user.entity';
import { AppModule } from '../src/app.module';
import { v4 as uuid } from 'uuid';

describe('UsersController (e2e)', () => {
    let app: INestApplication;

    const users = [
        {
            id: uuid(),
            email: 'testuser1@gmail.com',
            password: '123456',
            name: 'User A',
            last_name: 'User A',
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

    const mockUserService = {
        findAll: jest.fn(() => users),
        findOne: jest.fn((id: string) => users.find(user => user.id === id)),
        createUser: jest.fn((data: Users) => ({ id: '4', ...data })),
        update: jest.fn((id: string, data: Users) => ({ id, ...data })),
        remove: jest.fn((id: string) => ({})),
    };

    const mockJwtService = {
        sign: jest.fn(() => 'mocked-token'),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(AuthService)
            .useValue(mockUserService)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/auth (GET)', async () => {
        return request(app.getHttpServer())
            .get('/auth')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(users);
            });
    });

    it('/auth (POST)', async () => {
        const newUser = {
            email: 'testuser4@gmail.com',
            password: '123456',
            name: 'User D',
            last_name: 'User D',
            user_code: 'USER004',
            role: 'student',
        };
        return request(app.getHttpServer())
            .post('/auth')
            .send(newUser)
            .expect('Content-Type', /json/)
            .expect(201)
            .then((response) => {
                expect(response.body).toEqual({ id: '4', ...newUser });
            });
    });

    it('/auth/:id (PATCH)', async () => {
        const userId = '1';
        const updatedUser = {
            name: 'Updated',
        };
        return request(app.getHttpServer())
            .put(`/auth/${userId}`)
            .send(updatedUser)
            .expect('Content-Type', /json/)
            .expect(404);
    });

    it('/auth/:id (DELETE)', async () => {
        const userId = '1';
        return request(app.getHttpServer())
            .delete(`/auth/${userId}`)
            .expect(200);
    });
});