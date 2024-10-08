import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CriteriaGradeService } from '../src/criteria_grade/criteria_grade.service';
import { AuthService } from '../src/auth/auth.service';
import { CriteriaGrade } from '../src/criteria_grade/entities/criteria_grade.entity';
import { AppModule } from '../src/app.module';
import { v4 as uuid } from 'uuid';
import { LoginUserDto } from '../src/auth/dto/login-user.dto';

describe('CriteriaGradeController (e2e)', () => {
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

    const criteriaGrades = [
        {
            id: uuid(),
            criteria: '1',
            student: 'USER001',
            studentEval: 'USER002',
            grade: 85,
        },
        {
            id: uuid(),
            criteria: '2',
            student: 'USER001',
            studentEval: 'USER002',
            grade: 90,
        },
    ];

    const mockCriteriaGradeService = {
        findAll: jest.fn(() => criteriaGrades),
        findOne: jest.fn((id: string) => criteriaGrades.find(grade => grade.id === id)),
        create: jest.fn((data: CriteriaGrade) => ({ id: uuid(), ...data })),
        update: jest.fn((id: string, data: CriteriaGrade) => ({ id, ...data })),
        remove: jest.fn((id: string) => ({})),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(CriteriaGradeService)
            .useValue(mockCriteriaGradeService)
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

    it('/criteria-grade (GET)', async () => {
        return request(app.getHttpServer())
            .get('/criteria-grade')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(criteriaGrades);
            });
    });

    it('/criteria-grade (POST)', async () => {
        const newCriteriaGrade = {
            criteria: '3',
            student: 'USER001',
            studentEval: 'USER002',
            grade: 95,
        };
        return request(app.getHttpServer())
            .post('/criteria-grade')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(newCriteriaGrade)
            .expect('Content-Type', /json/)
            .expect(201)
            .then((response) => {
                expect(response.body).toEqual({ id: expect.any(String), ...newCriteriaGrade });
            });
    });

    it('/criteria-grade/:id (PATCH)', async () => {
        const criteriaGradeId = criteriaGrades[0].id;
        const updatedGrade = { grade: 100 };

        return request(app.getHttpServer())
            .patch(`/criteria-grade/${criteriaGradeId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updatedGrade)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.grade).toBe(100);
            });
    });

    it('/criteria-grade/:id (DELETE)', async () => {
        const criteriaGradeId = criteriaGrades[0].id;

        return request(app.getHttpServer())
            .delete(`/criteria-grade/${criteriaGradeId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
    });
});
