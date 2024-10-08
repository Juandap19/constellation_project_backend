import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activitty.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

describe('ActivityController', () => {
  let controller: ActivityController;

  const mockActivityService = {
    findAll: jest.fn(() => [
      { id: '1', name: 'Activity 1', description: 'Description 1', course: 'Course 1' },
      { id: '2', name: 'Activity 2', description: 'Description 2', course: 'Course 2' },
    ]),
    findOne: jest.fn((id: string) => ({
      id,
      name: 'Activity 1',
      description: 'Description 1',
      course: 'Course 1',
    })),
    create: jest.fn((createActivityDto: CreateActivityDto) => ({
      id: '3',
      ...createActivityDto,
    })),
    update: jest.fn((id: string, updateActivityDto: UpdateActivityDto) => ({
      id,
      ...updateActivityDto,
    })),
    remove: jest.fn((id: string) => ({
      id,
      name: 'Activity 1',
      description: 'Description 1',
      course: 'Course 1',
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [ActivityService],
    })
      .overrideProvider(ActivityService)
      .useValue(mockActivityService)
      .compile();

    controller = module.get<ActivityController>(ActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all activities', async () => {
    const result = await controller.findAll();
    expect(mockActivityService.findAll).toHaveBeenCalled();
    expect(result).toEqual([
      { id: '1', name: 'Activity 1', description: 'Description 1', course: 'Course 1' },
      { id: '2', name: 'Activity 2', description: 'Description 2', course: 'Course 2' },
    ]);
  });

  it('should return a single activity by id', async () => {
    const result = await controller.findOne('1');
    expect(mockActivityService.findOne).toHaveBeenCalledWith('1');
    expect(result).toEqual({
      id: '1',
      name: 'Activity 1',
      description: 'Description 1',
      course: 'Course 1',
    });
  });

  it('should create an activity', async () => {
    const createActivityDto: CreateActivityDto = {
      name: 'New Activity',
      description: 'New Description',
      course: 'Course 1',
    };

    const result = await controller.create(createActivityDto);
    expect(mockActivityService.create).toHaveBeenCalledWith(createActivityDto);
    expect(result).toEqual({
      id: '3',
      ...createActivityDto,
    });
  });

  it('should update an activity', async () => {
    const updateActivityDto: UpdateActivityDto = {
      name: 'Updated Activity',
      description: 'Updated Description',
      courseId: '1',
    };

    const result = await controller.update('1', updateActivityDto);
    expect(mockActivityService.update).toHaveBeenCalledWith('1', updateActivityDto);
    expect(result).toEqual({
      id: '1',
      ...updateActivityDto,
    });
  });

  it('should delete an activity', async () => {
    const result = await controller.remove('1');
    expect(mockActivityService.remove).toHaveBeenCalledWith('1');
    expect(result).toEqual({
      id: '1',
      name: 'Activity 1',
      description: 'Description 1',
      course: 'Course 1',
    });
  });
});
