import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { NotFoundException } from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';
import { CreateActivityDto } from './dto/create-activitty.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { v4 as uuid } from 'uuid';

describe('ActivityService', () => {
  let service: ActivityService;
  let activityRepository: Repository<Activity>;
  let courseService: CoursesService;

  const mockActivityRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCoursesService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        {
          provide: getRepositoryToken(Activity),
          useValue: mockActivityRepository,
        },
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
    activityRepository = module.get<Repository<Activity>>(getRepositoryToken(Activity));
    courseService = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of activities', async () => {
      const mockActivities = [{ id: '1', name: 'Activity 1' }];
      mockActivityRepository.find.mockResolvedValue(mockActivities);

      const result = await service.findAll();
      expect(result).toEqual(mockActivities);
      expect(activityRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single activity', async () => {
      const mockActivity = { id: '1', name: 'Activity 1' };
      mockActivityRepository.findOne.mockResolvedValue(mockActivity);

      const result = await service.findOne('1');
      expect(result).toEqual(mockActivity);
      expect(activityRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if activity not found', async () => {
      mockActivityRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new activity', async () => {
      const createActivityDto: CreateActivityDto = {
        name: 'New Activity',
        description: 'Description',
        course: 'Course 1',
      };

      const mockCourse = { id: 'Course 1', name: 'Course 1' };
      const mockActivity = { id: uuid(), ...createActivityDto, course: mockCourse };

      mockCoursesService.findOne.mockResolvedValue(mockCourse);
      mockActivityRepository.save.mockResolvedValue(mockActivity);

      const result = await service.create(createActivityDto);
      expect(result).toEqual(mockActivity);
      expect(courseService.findOne).toHaveBeenCalledWith(createActivityDto.course);
      expect(activityRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Activity',
        description: 'Description',
        course: mockCourse,
      }));
    });
  });

  describe('update', () => {
    it('should update and return the updated activity', async () => {
      const updateActivityDto: UpdateActivityDto = {
        name: 'Updated Activity',
        description: 'Updated Description',
        courseId: 'Course 1',
      };

      const mockActivity = { id: '1', name: 'Activity 1', description: 'Description 1' };

      mockActivityRepository.findOne.mockResolvedValue(mockActivity);
      mockActivityRepository.update.mockResolvedValue(null);
      mockActivityRepository.findOne.mockResolvedValue({ id: '1', ...updateActivityDto });

      const result = await service.update('1', updateActivityDto);
      expect(result).toEqual({ id: '1', ...updateActivityDto });
      expect(activityRepository.update).toHaveBeenCalledWith('1', updateActivityDto);
      expect(activityRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if activity not found during update', async () => {
      mockActivityRepository.findOne.mockResolvedValue(null);

      await expect(service.update('1', { name: 'Updated Activity', courseId:'1' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an activity', async () => {
      const mockActivity = { id: '1', name: 'Activity 1' };
      mockActivityRepository.findOne.mockResolvedValue(mockActivity);
      mockActivityRepository.delete.mockResolvedValue(null);

      await service.remove('1');
      expect(activityRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(activityRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if activity not found during remove', async () => {
      mockActivityRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
