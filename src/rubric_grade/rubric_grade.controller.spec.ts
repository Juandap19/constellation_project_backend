import { Test, TestingModule } from '@nestjs/testing';
import { RubricGradeController } from './rubric_grade.controller';
import { RubricGradeService } from './rubric_grade.service';
import { CreateRubricGradeDto } from './dto/create-rubric_grade.dto';


describe('RubricGradeController', () => {
  let controller: RubricGradeController;

  const mockRubricGradeService = {
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
      controllers: [RubricGradeController],
      providers: [RubricGradeService],
    }).overrideProvider(RubricGradeService).useValue(mockRubricGradeService)
    .compile();

    controller = module.get<RubricGradeController>(RubricGradeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return a new rubric grade', async () => {
      const createRubricGradeDto: CreateRubricGradeDto = {rubric: 'f450fe0f-8973-4d77-a630-577ec4d7f132', student:'151f9560-eaef-4694-9a69-3f4bb4d571e7', studentEval: '19cadee7-54dd-48d7-983b-0d083beed3cd'};
      mockRubricGradeService.create.mockResolvedValue(createRubricGradeDto);

      expect(await controller.create(createRubricGradeDto)).toEqual({rubric: 'f450fe0f-8973-4d77-a630-577ec4d7f132', student:'151f9560-eaef-4694-9a69-3f4bb4d571e7', studentEval: '19cadee7-54dd-48d7-983b-0d083beed3cd'});
      expect(mockRubricGradeService.create).toHaveBeenCalledWith(createRubricGradeDto);
      expect(mockRubricGradeService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of rubric grades', async () => {
      const result = [{ rubric: 'rubric1', student: 'student1', studentEval: 'eval1' }];
      mockRubricGradeService.findAll.mockResolvedValue(result);
  
      expect(await controller.findAll()).toBe(result);
      expect(mockRubricGradeService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single rubric grade by id', async () => {
      const result = { rubric: 'rubric1', student: 'student1', studentEval: 'eval1' };
      const id = 'some-id';
      mockRubricGradeService.findOne.mockResolvedValue(result);
  
      expect(await controller.findOne(id)).toBe(result);
      expect(mockRubricGradeService.findOne).toHaveBeenCalledWith(id);
      expect(mockRubricGradeService.findOne).toHaveBeenCalledTimes(1);
      
    });
  });
  
  describe('update', () => {
    it('should update an existing rubric grade', async () => {
      const id = 'some-id';
      const updateRubricGradeDto = { rubric: 'rubric1', student: 'student1', studentEval: 'eval2' };
      const updatedRubricGrade = { ...updateRubricGradeDto, id };
      mockRubricGradeService.update.mockResolvedValue(updatedRubricGrade);
  
      expect(await controller.update(id, updateRubricGradeDto)).toBe(updatedRubricGrade);
      expect(mockRubricGradeService.update).toHaveBeenCalledWith(id, updateRubricGradeDto);
      expect(mockRubricGradeService.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delete a rubric grade', async () => {
      const id = 'some-id';
      mockRubricGradeService.remove.mockResolvedValue(undefined); 
  
      expect(await controller.remove(id)).toBeUndefined(); 
      expect(mockRubricGradeService.remove).toHaveBeenCalledWith(id); 
      expect(mockRubricGradeService.findOne).toHaveBeenCalledTimes(1);
    });
  });
  
});

