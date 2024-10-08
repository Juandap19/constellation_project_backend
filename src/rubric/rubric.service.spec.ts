import { Test, TestingModule } from '@nestjs/testing';
import { RubricService } from './rubric.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rubric } from './entities/rubric.entity';
import { Activity } from '../activity/entities/activity.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateRubricDto } from './dto/create-rubric.dto';
import { UpdateRubricDto } from './dto/update-rubric.dto';

describe('RubricService', () => {
  let service: RubricService;
  let rubricRepository: Repository<Rubric>;
  let activityRepository: Repository<Activity>;

  const mockRubricRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    query: jest.fn(),
  };

  const mockActivityRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RubricService,
        { provide: getRepositoryToken(Rubric), useValue: mockRubricRepository },
        { provide: getRepositoryToken(Activity), useValue: mockActivityRepository },
      ],
    }).compile();

    service = module.get<RubricService>(RubricService);
    rubricRepository = module.get<Repository<Rubric>>(getRepositoryToken(Rubric));
    activityRepository = module.get<Repository<Activity>>(getRepositoryToken(Activity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a rubric', async () => {
      const createRubricDto: CreateRubricDto = {
        name: 'Rubric 1',
        activityId: 'activity-id',
      };

      const activity = { id: 'activity-id' };
      const rubric = { id: 'rubric-id', ...createRubricDto };

      mockActivityRepository.findOne.mockResolvedValue(activity);
      mockRubricRepository.save.mockResolvedValue(rubric);

      const result = await service.create(createRubricDto);

      expect(result).toEqual(rubric);
      expect(mockActivityRepository.findOne).toHaveBeenCalledWith({ where: { id: 'activity-id' } });
      expect(mockRubricRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if activity is not found', async () => {
      mockActivityRepository.findOne.mockResolvedValue(null);

      const createRubricDto: CreateRubricDto = {
        name: 'Rubric 1',
        activityId: 'invalid-activity-id',
      };

      await expect(service.create(createRubricDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all rubrics', async () => {
      const rubrics = [{ id: 'rubric-id', name: 'Rubric 1' }];
      mockRubricRepository.find.mockResolvedValue(rubrics);

      const result = await service.findAll();
      expect(result).toEqual(rubrics);
      expect(mockRubricRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a rubric by id', async () => {
      const rubric = { id: 'rubric-id', name: 'Rubric 1' };
      mockRubricRepository.findOne.mockResolvedValue(rubric);

      const result = await service.findOne('rubric-id');
      expect(result).toEqual(rubric);
      expect(mockRubricRepository.findOne).toHaveBeenCalledWith({ where: { id: 'rubric-id' }, relations: ['activity', 'criterias'] });
    });

    it('should throw NotFoundException if rubric is not found', async () => {
      mockRubricRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a rubric', async () => {
      const updateRubricDto: UpdateRubricDto = { name: 'Updated Rubric', activityId: '1' };
      const rubric = { id: 'rubric-id', name: 'Rubric 1' };
      const updatedRubric = { ...rubric, ...updateRubricDto };
      const activity = { id: 'activity-id' };

      mockRubricRepository.findOne.mockResolvedValue(rubric);
      mockActivityRepository.findOne.mockResolvedValue(activity);
      mockRubricRepository.save.mockResolvedValue(updatedRubric);

      const result = await service.update('rubric-id', updateRubricDto);

      expect(result).toEqual(updatedRubric);
      expect(mockRubricRepository.findOne).toHaveBeenCalledWith({ where: { id: 'rubric-id' }, relations: ['activity', 'criterias'] });
      expect(mockRubricRepository.save).toHaveBeenCalledWith(updatedRubric);
    });

    it('should throw NotFoundException if rubric is not found', async () => {
      mockRubricRepository.findOne.mockResolvedValue(null);

      await expect(service.update('invalid-id', { name: 'Updated Rubric' , activityId:'1'})).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if activity is not found', async () => {
      const rubric = { id: 'rubric-id', name: 'Rubric 1' };
      mockRubricRepository.findOne.mockResolvedValue(rubric);
      mockActivityRepository.findOne.mockResolvedValue(null);

      const updateRubricDto: UpdateRubricDto = { name: 'Updated Rubric', activityId: 'invalid-activity-id' };

      await expect(service.update('rubric-id', updateRubricDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a rubric', async () => {
      const rubric = { id: 'rubric-id', name: 'Rubric 1' };

      mockRubricRepository.findOne.mockResolvedValue(rubric);
      mockRubricRepository.remove.mockResolvedValue(rubric);

      const result = await service.remove('rubric-id');

      expect(result).toEqual(undefined); //se coloca asi porque ya no se recibe nada, es decir, ya la rubrica no esta en la base de datos, por ende es undefined
      expect(mockRubricRepository.remove).toHaveBeenCalledWith(rubric);
    });

    it('should throw NotFoundException if rubric is not found', async () => {
      mockRubricRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });

    it('should remove a rubric and its criteria', async () => {
      const rubric = { id: 'rubric-id', name: 'Rubric 1' };
      const criterias = [{ id: 'criteria-id', rubric }];
    
      mockRubricRepository.findOne.mockResolvedValue(rubric);
      mockRubricRepository.remove.mockResolvedValue(rubric);
    
      const result = await service.remove('rubric-id');
    
      expect(result).toEqual(undefined); //Esto es debido a que no hay nada ya que elimino la rubrica
      expect(mockRubricRepository.remove).toHaveBeenCalledWith(rubric);
    });
    

  });
});
