import { Test, TestingModule } from "@nestjs/testing";
import { CriteriaGradeController } from "./criteria_grade.controller";
import { CriteriaGradeService } from "./criteria_grade.service";
import { CreateCriteriaGradeDto } from "./dto/create-criteria_grade.dto";

describe('CriteriaGradeController', () => {
    let controller: CriteriaGradeController;

    const mockCriteriaGradeService = {
        create: jest.fn((dto) => {
            return {
                id: 'some-unique-id',
                ...dto,
            };
        }),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CriteriaGradeController],
            providers: [CriteriaGradeService],
        }).overrideProvider(CriteriaGradeService).useValue(mockCriteriaGradeService)
        .compile();

        controller = module.get<CriteriaGradeController>(CriteriaGradeController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should return a new rubric grade', async () => {
        const createCriteriaGradeDto: CreateCriteriaGradeDto = {criteria: 'f450fe0f-8973-4d77-a630-577ec4d7f132', student:'151f9560-eaef-4694-9a69-3f4bb4d571e7', studentEval: '19cadee7-54dd-48d7-983b-0d083beed3cd', grade: 5};
        mockCriteriaGradeService.create.mockResolvedValue(createCriteriaGradeDto);
    
        expect(await controller.create(createCriteriaGradeDto)).toEqual({ criteria: 'f450fe0f-8973-4d77-a630-577ec4d7f132', student:'151f9560-eaef-4694-9a69-3f4bb4d571e7', studentEval: '19cadee7-54dd-48d7-983b-0d083beed3cd', grade: 5});
        expect(mockCriteriaGradeService.create).toHaveBeenCalledWith(createCriteriaGradeDto);
        expect(mockCriteriaGradeService.create).toHaveBeenCalledTimes(1);
        });
    });

    describe('findAll', () => {
        it('should return an array of rubric grades', async () => {
        const result = [{ criteria: 'criteria1', student: 'student1', studentEval: 'eval1', grade: 5 }];
        mockCriteriaGradeService.findAll.mockResolvedValue(result);
    
        expect(await controller.findAll()).toBe(result);
        expect(mockCriteriaGradeService.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('findOne', () => {
        it('should return a single rubric grade by id', async () => {
        const result = { criteria: 'criteria1', student: 'student1', studentEval: 'eval1', grade: 5 };
        const id = 'some-id';
        mockCriteriaGradeService.findOne.mockResolvedValue(result);
    
        expect(await controller.findOne(id)).toBe(result);
        expect(mockCriteriaGradeService.findOne).toHaveBeenCalledWith(id);
        expect(mockCriteriaGradeService.findOne).toHaveBeenCalledTimes(1);

        });
    });

    describe('update', () => {
        it('should update an existing rubric grade', async () => {
        const id = 'some-id';
        const updateRubricGradeDto = { criteria: 'criteria2', student: 'student2', studentEval: 'eval2', grade: 5 };
        const updatedRubricGrade = { ...updateRubricGradeDto, id };
        mockCriteriaGradeService.update.mockResolvedValue(updatedRubricGrade);
    
        expect(await controller.update(id, updateRubricGradeDto)).toBe(updatedRubricGrade);
        expect(mockCriteriaGradeService.update).toHaveBeenCalledWith(id, updateRubricGradeDto);
        expect(mockCriteriaGradeService.update).toHaveBeenCalledTimes(1);
        });
    });

    describe('remove', () => {
        it('should delete a rubric grade', async () => {
        const id = 'some-id';
        mockCriteriaGradeService.remove.mockResolvedValue(undefined); 
    
        expect(await controller.remove(id)).toBeUndefined(); 
        expect(mockCriteriaGradeService.remove).toHaveBeenCalledWith(id); 
        expect(mockCriteriaGradeService.remove).toHaveBeenCalledTimes(1);
        });
    });

});