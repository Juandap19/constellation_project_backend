import { Test, TestingModule } from '@nestjs/testing';
import { CriteriaController } from './criteria.controller';
import { CriteriaService } from './criteria.service';
import { CreateCriteriaDto } from './dto/create-criteria.dto';
import { UpdateCriteriaDto } from './dto/update-criteria.dto';
import { Criteria } from './entities/criteria.entity';

describe('CriteriaController', () => {
  let controller: CriteriaController;
  let service: CriteriaService;

  const mockCriteriaService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CriteriaController],
      providers: [CriteriaService],
    }).overrideProvider(CriteriaService).useValue(mockCriteriaService).compile();

    controller = module.get<CriteriaController>(CriteriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new criteria', async () => {
      const createCriteriaDto: CreateCriteriaDto = {
        name: 'Test Criteria',
        description: 'Test Description',
        percentage: 50,
        rubric: '123e4567-e89b-12d3-a456-426614174000',
      };
      const expectedResult = { id: '123456789', ...createCriteriaDto };

      mockCriteriaService.create.mockResolvedValue(expectedResult);

      expect(await controller.create(createCriteriaDto)).toBe(expectedResult);
      expect(mockCriteriaService.create).toHaveBeenCalledWith(createCriteriaDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of criteria', async () => {
      const expectedResult = [
        { id: '1', name: 'Criteria 1' },
        { id: '2', name: 'Criteria 2' },
      ];

      mockCriteriaService.findAll.mockResolvedValue(expectedResult);

      expect(await controller.findAll()).toBe(expectedResult);
      expect(mockCriteriaService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single criteria', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult = { id, name: 'Test Criteria' };

      mockCriteriaService.findOne.mockResolvedValue(expectedResult);

      expect(await controller.findOne(id)).toBe(expectedResult);
      expect(mockCriteriaService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a criteria', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateCriteriaDto: UpdateCriteriaDto = {
        name: 'Updated Criteria',
        description: 'Updated Description',
        percentage: 75,
        rubric: '123e4567-e89b-12d3-a456-426614174000',
        student: '123e456',
        studentEval: '123e987',
      };
      const expectedResult = { id, ...updateCriteriaDto };

      mockCriteriaService.update.mockResolvedValue(expectedResult);

      expect(await controller.update(id, updateCriteriaDto)).toBe(expectedResult);
      expect(mockCriteriaService.update).toHaveBeenCalledWith(id, updateCriteriaDto);
    });
  });

  describe('remove', () => {
    it('should remove a criteria', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult = { id, name: 'Deleted Criteria' };

      mockCriteriaService.remove.mockResolvedValue(expectedResult);

      expect(await controller.remove(id)).toBe(expectedResult);
      expect(mockCriteriaService.remove).toHaveBeenCalledWith(id);
    });
  });
});