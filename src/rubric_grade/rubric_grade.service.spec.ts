import { Test, TestingModule } from "@nestjs/testing";
import { RubricGradeService } from "./rubric_grade.service";
import { RubricGradeController } from "./rubric_grade.controller";
import { NotFoundException } from "@nestjs/common";

describe('RubricGradeService', () => {
    let service: RubricGradeService;

    const mockRubricGradeService = {
        create: jest.fn((dto) => {
            return {
                id: 'some-unique-id',
                ...dto,
            };
        }),
        findAll: jest.fn().mockResolvedValue([
            { id: '1', rubric: 'f450fe0f-8973-4d77-a630-577ec4d7f132', student: 'student-1', studentEval: 'evaluator-1' },
            { id: '2', rubric: 'f450fe0f-8973-4d77-a630-577ec4d7f132', student: 'student-2', studentEval: 'evaluator-2' },
        ]),
        findOne: jest.fn().mockImplementation((id: string) => {
            if (id === 'existing-id') {
                return { id: 'existing-id', rubric: 'some-rubric', student: 'student-1', studentEval: 'evaluator-1' };
            }
            throw new NotFoundException(`Rubric grade with ID ${id} not found`);
        }),
        update: jest.fn().mockResolvedValue({ id: 'existing-id', rubric: 'updated-rubric',student: 'student-E', studentEval: 'evaluator-E' }),
        remove: jest.fn((id) => (undefined)),
    };
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RubricGradeController],
            providers: [RubricGradeService]
        }).overrideProvider(RubricGradeService)
        .useValue(mockRubricGradeService)
        .compile();
    
        service = module.get<RubricGradeService>(RubricGradeService);
    });
    
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a new rubric grade', async () => {
        const createRubricGradeDto = {rubric: 'f450fe0f-8973-4d77-a630-577ec4d7f132', student:'151f9560-eaef-4694-9a69-3f4bb4d571e7', studentEval: '19cadee7-54dd-48d7-983b-0d083beed3cd'};

        expect( await service.create(createRubricGradeDto)).toEqual({id: expect.any(String), ...createRubricGradeDto});
        
    });

    it('should find all rubric grades', async () => {
        const result = await service.findAll();
        expect(result.length).toBe(2);
        expect(result[0]).toEqual({
            id: '1',
            rubric: 'f450fe0f-8973-4d77-a630-577ec4d7f132',
            student: 'student-1',
            studentEval: 'evaluator-1',
        });
    });

    it('should find a rubric grade by id', async () => {
        const result = await service.findOne('existing-id');
        expect(result).toEqual({
            id: 'existing-id',
            rubric: 'some-rubric',
            student: 'student-1',
            studentEval: 'evaluator-1',
        });
    });

    it('should remove a rubric grade', async () => {
        const result = await service.remove('existing-id');
        expect(result).toBeUndefined();
    });

    it('should throw an exception if rubric grade not found', async () => {
        try {
            await service.findOne('non-existing-id');
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
            expect(e.message).toBe('Rubric grade with ID non-existing-id not found');
        }
    });

    it('should update a rubric grade', async () => {
        const updateRubricGradeDto = { rubric: 'updated-rubric',student: 'student-E', studentEval: 'evaluator-E' };
        expect(await service.update('existing-id', updateRubricGradeDto)).toEqual({ id: 'existing-id', rubric: 'updated-rubric',student: 'student-E', studentEval: 'evaluator-E' });
    });

    it('should throw an exception when updating a non-existing rubric grade', async () => {
        const updateRubricGradeDto = { rubric: 'non-existing-rubric' };
    
        try {
            await service.update('non-existing-id', updateRubricGradeDto);
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
            expect(e.message).toBe(`Criteria grade with ID non-existing-id not found`);
        }
    });
});