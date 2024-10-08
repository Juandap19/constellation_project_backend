import { Test, TestingModule } from "@nestjs/testing";
import { CriteriaGradeController } from "./criteria_grade.controller";
import { CriteriaGradeService } from "./criteria_grade.service";
import { NotFoundException } from "@nestjs/common";

describe('CriteriaGradeService', () => {
    let service: CriteriaGradeService;

    const mockCriteriaGradeRepository = {
        create: jest.fn((dto) => ({
            id: 'some-unique-id',
            ...dto,
        })),
        findAll: jest.fn().mockResolvedValue([
            { id: '1', criteria: 'f450fe0f-8973-4d77-a630-577ec4d7f132', student: 'student-1', studentEval: 'evaluator-1', grade: 5 },
            { id: '2', criteria: 'f450fe0f-8973-4d77-a630-577ec4d7f132', student: 'student-2', studentEval: 'evaluator-2', grade: 5 },
        ]),
        findOne: jest.fn().mockImplementation((id: string) => {
            if (id === 'existing-id') {
                return { id: 'existing-id', criteria: 'some-criteria', student: 'student-1', studentEval: 'evaluator-1', grade: 5 };
            }
            throw new NotFoundException(`Criteria grade with ID ${id} not found`);
        }),
        update: jest.fn().mockImplementation((id, dto) => {
            if (id === 'existing-id') {
                return { id: 'existing-id', ...dto };
            }
            throw new NotFoundException(`Criteria grade with ID ${id} not found`);
        }),
        remove: jest.fn((id) => (undefined)),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CriteriaGradeController],
            providers: [
                {
                    provide: CriteriaGradeService,
                    useValue: mockCriteriaGradeRepository,
                },
            ],
        }).compile();

        service = module.get<CriteriaGradeService>(CriteriaGradeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a new criteria grade successfully', async () => {
        const createCriteriaGradeDto = {
            criteria: 'criteria-id',
            student: 'student-id',
            studentEval: 'evaluator-id',
            grade: 5,
        };

        expect(await service.create(createCriteriaGradeDto)).toEqual({
            id: expect.any(String),
            ...createCriteriaGradeDto,
        });
    });

    it('should find all criteria grades', async () => {
        const result = await service.findAll();
        expect(result.length).toBe(2);
        expect(result[0]).toEqual({
            id: '1',
            criteria: 'f450fe0f-8973-4d77-a630-577ec4d7f132',
            student: 'student-1',
            studentEval: 'evaluator-1',
            grade: 5,
        });
    });

    it('should find a criteria grade by id', async () => {
        const result = await service.findOne('existing-id');
        expect(result).toEqual({
            id: 'existing-id',
            criteria: 'some-criteria',
            student: 'student-1',
            studentEval: 'evaluator-1',
            grade: 5,
        });
    });

    it('should remove a criteria grade', async () => {
        expect(await service.remove('existing-id')).toBeUndefined();
        expect(mockCriteriaGradeRepository.remove).toHaveBeenCalledWith('existing-id');
    });

    it('should throw an exception if criteria grade not found', async () => {
        try {
            await service.findOne('non-existing-id');
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
            expect(e.message).toBe('Criteria grade with ID non-existing-id not found');
        }
    });

    it('should update a criteria grade', async () => {
        const updateCriteriaGradeDto = {
            criteria: 'updated-criteria',
            student: 'student-2',
            studentEval: 'evaluator-2',
            grade: 3,
        };
        expect(await service.update('existing-id', updateCriteriaGradeDto)).toEqual({
            id: 'existing-id',
            ...updateCriteriaGradeDto,
        });
    });

    it('should throw an exception when updating a non-existing criteria grade', async () => {
        const updateCriteriaGradeDto = { criteria: 'non-existing-criteria', student: null, studentEval: null, grade: 0 };

        try {
            await service.update('non-existing-id', updateCriteriaGradeDto);
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
            expect(e.message).toBe(`Criteria grade with ID non-existing-id not found`);
        }
    });
});
