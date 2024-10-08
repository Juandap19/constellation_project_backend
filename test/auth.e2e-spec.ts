import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthService } from '../src/auth/auth.service';
import { Users } from '../src/auth/entities/user.entity';
import { AppModule } from '../src/app.module';
import { v4 as uuid } from 'uuid';
import { LoginUserDto } from '../src/auth/dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';

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

    const mockAuthService = {
        loginUser: jest.fn(({ email, password }: LoginUserDto) => {
            const user = users.find(user => user.email === email && user.password === password);
            if (!user) {
                throw new UnauthorizedException();
            }
            return { access_token: 'mocked-token' };
        }),
        findAll: jest.fn(() => users),
        findOne: jest.fn((id: string) => users.find(user => user.id === id)),
        createUser: jest.fn((data: Users) => ({ id: '4', ...data })),
        update: jest.fn((id: string, data: Users) => ({ id, ...data })),
        remove: jest.fn((id: string) => ({})),
    };


    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(AuthService)
            .useValue(mockAuthService)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    }, 70 * 1000);

    it('/login (POST)', async () => {
        const loginDto = {
            email: 'testuser1@gmail.com',
            password: '123456',
        };

        return request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .expect('Content-Type', /json/)
            .expect(201)
            .then((response) => {
                expect(response.body).toEqual({ access_token: 'mocked-token' });
                expect(mockAuthService.loginUser).toHaveBeenCalledWith(loginDto);
            });
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
