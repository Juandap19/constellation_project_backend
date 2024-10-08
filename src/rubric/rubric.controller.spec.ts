import { Test, TestingModule } from '@nestjs/testing';
import { RubricController } from './rubric.controller';
import { RubricService } from './rubric.service';
import { CreateRubricDto } from './dto/create-rubric.dto';
import { UpdateRubricDto } from './dto/update-rubric.dto';

describe('RubricController', () => {
  let controller: RubricController;
  let service: RubricService;

  const mockRubricService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RubricController],
      providers: [RubricService],
    }).overrideProvider(RubricService).useValue(mockRubricService).compile();

    controller = module.get<RubricController>(RubricController);
    service = module.get<RubricService>(RubricService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new rubric', async () => {
      const createRubricDto: CreateRubricDto = {
        name: 'Test Rubric',
        activityId: '123e456',
      };
      const expectedResult = { id: 'some-uuid', ...createRubricDto };

      mockRubricService.create.mockResolvedValue(expectedResult);

      expect(await controller.create(createRubricDto)).toBe(expectedResult);
      expect(mockRubricService.create).toHaveBeenCalledWith(createRubricDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of rubrics', async () => {
      const expectedResult = [
        { id: '1', name: 'Rubric 1' },
        { id: '2', name: 'Rubric 2' },
      ];

      mockRubricService.findAll.mockResolvedValue(expectedResult);

      expect(await controller.findAll()).toBe(expectedResult);
      expect(mockRubricService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single rubric', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult = { id, name: 'Test Rubric' };

      mockRubricService.findOne.mockResolvedValue(expectedResult);

      expect(await controller.findOne(id)).toBe(expectedResult);
      expect(mockRubricService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a rubric', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateRubricDto: UpdateRubricDto = {
        name: 'Updated Rubric',
        activityId: '123e456',
      };
      const expectedResult = { id, ...updateRubricDto };

      mockRubricService.update.mockResolvedValue(expectedResult);

      expect(await controller.update(id, updateRubricDto)).toBe(expectedResult);
      expect(mockRubricService.update).toHaveBeenCalledWith(id, updateRubricDto);
    });
  });

  describe('remove', () => {
    it('should remove a rubric', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';

      mockRubricService.remove.mockResolvedValue(undefined);

      await expect(controller.remove(id)).resolves.toBeUndefined();
      expect(mockRubricService.remove).toHaveBeenCalledWith(id);
    });
  });
});