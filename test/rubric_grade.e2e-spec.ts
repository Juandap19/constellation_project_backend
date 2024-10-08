import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RubricGradeService } from '../src/rubric_grade/rubric_grade.service';
import { AuthService } from '../src/auth/auth.service';
import { RubricService } from '../src/rubric/rubric.service';
import { AppModule } from '../src/app.module';
import { v4 as uuid } from 'uuid';
import { LoginUserDto } from '../src/auth/dto/login-user.dto';

describe('RubricGradeController (e2e)', () => {
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
            description: 'Evaluation rubric 1',
        },
        {
            id: uuid(),
            name: 'Rubric 2',
            description: 'Evaluation rubric 2',
        },
    ];

    const rubricGrades = [
        {
            id: uuid(),
            rubric: rubrics[0],
            student: users[0],
            studentEval: users[1],
            grade: 85,
        },
        {
            id: uuid(),
            rubric: rubrics[1],
            student: users[1],
            studentEval: users[0],
            grade: 90,
        },
    ];

    const mockRubricGradeService = {
        findAll: jest.fn(() => rubricGrades),
        findOne: jest.fn((id: string) => rubricGrades.find((grade) => grade.id === id)),
        create: jest.fn((data) => ({ id: '4', ...data })),
        update: jest.fn((id: string, data) => ({ id, ...data })),
        remove: jest.fn((id: string) => ({})),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(RubricGradeService)
            .useValue(mockRubricGradeService)
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

    it('/rubric-grade (GET)', async () => {
        return request(app.getHttpServer())
            .get('/rubric-grade')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(rubricGrades);
            });
    });

    it('/rubric-grades (POST)', async () => {
        const newRubricGrade = {
            rubric: rubrics[0].id,
            student: users[0].id,
            studentEval: users[1].id,
            grade: 75,
        };
        return request(app.getHttpServer())
            .post('/rubric-grade')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(newRubricGrade)
            .expect('Content-Type', /json/)
            .expect(201)
            .then((response) => {
                expect(response.body).toEqual({ id: '4', ...newRubricGrade });
            });
    });

    it('/rubric-grade/:id (PATCH)', async () => {
        const rubricGradeId = rubricGrades[0].id;
        const updatedRubricGrade = {
            grade: 95,
        };
        return request(app.getHttpServer())
            .patch(`/rubric-grade/${rubricGradeId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updatedRubricGrade)
            .expect('Content-Type', /json/)
            .expect(200);
    });

    it('/rubric-grade/:id (DELETE)', async () => {
        const rubricGradeId = rubricGrades[0].id;
        return request(app.getHttpServer())
            .delete(`/rubric-grade/${rubricGradeId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
    });
});
