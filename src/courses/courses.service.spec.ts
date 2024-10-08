import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { Users } from '../auth/entities/user.entity';
import { Team } from '../teams/entities/teams.entity';
import { TeamsService } from '../teams/teams.service';

describe('CoursesService', () => {
  let service: CoursesService;
  let mockCourseRepository: Partial<Repository<Course>>;
  let mockUserRepository: Partial<Repository<Users>>;
  let mockTeamRepository: Partial<Repository<Team>>;
  let mockAuthService: Partial<AuthService>;
  let mockTeamService: Partial<TeamsService>;

  const course = { id: uuid(), name: 'Math 101', description: 'Basic math', users: uuid() };
  const user = { id: uuid(), username: 'testuser', email: 'test@example.com', courses: [] };

  beforeEach(async () => {
    mockCourseRepository = {
      find: jest.fn().mockResolvedValue([course]),
      findOne: jest.fn().mockResolvedValue(course),
      create: jest.fn().mockReturnValue(course),
      save: jest.fn().mockResolvedValue(course),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    mockUserRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    mockTeamRepository = {
      save: jest.fn(),
    };

    mockAuthService = {
      findOne: jest.fn().mockResolvedValue(user),
      update: jest.fn().mockResolvedValue(user),
    };

    mockTeamService = {
      addTeamToUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: getRepositoryToken(Course), useValue: mockCourseRepository },
        { provide: getRepositoryToken(Users), useValue: mockUserRepository },
        { provide: getRepositoryToken(Team), useValue: mockTeamRepository },
        { provide: AuthService, useValue: mockAuthService },
        { provide: TeamsService, useValue: mockTeamService },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new course', async () => {
      const createCourseDto = {
        id:'1',
        name: 'Math 101',
        description: 'Basic math',
        users: uuid(),
      };
      mockAuthService.findOne = jest.fn().mockResolvedValue(user);
      
      const result = await service.create(createCourseDto);

      expect(mockAuthService.findOne).toHaveBeenCalledWith(createCourseDto.users);
      expect(mockCourseRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        ...createCourseDto,
        id: expect.any(String),
        users: user,
      }));
      expect(result).toEqual(course);
    });
  });

  describe('findAll', () => {
    it('should return all courses', async () => {
      const result = await service.findAll();
      expect(mockCourseRepository.find).toHaveBeenCalled();
      expect(result).toEqual([course]);
    });
  });

  describe('findOne', () => {
    it('should return a course by id', async () => {
      const result = await service.findOne(course.id);
      expect(mockCourseRepository.findOne).toHaveBeenCalledWith({
        where: { id: course.id },
      });
      expect(result).toEqual(course);
    });

    it('should throw NotFoundException if course not found', async () => {
      mockCourseRepository.findOne = jest.fn().mockResolvedValue(null);
      await expect(service.findOne(course.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a course by id', async () => {
      const updateCourseDto = {
        id: course.id,
        name: 'Math 102',
        users: uuid()
      };
      const updatedCourse = { ...course, ...updateCourseDto };

      const result = await service.update(course.id, updateCourseDto);

      expect(mockCourseRepository.findOne).toHaveBeenCalledWith({
        where: { id: course.id },
      });
      expect(mockCourseRepository.save).toHaveBeenCalledWith(updatedCourse);
      expect(result).toEqual(updatedCourse);
    });

    it('should throw NotFoundException if course to update is not found', async () => {
      mockCourseRepository.findOne = jest.fn().mockResolvedValue(null);
      const updateCourseDto = {
        id: uuid(),
        name: 'Math 102',
        users: uuid()
      };

      await expect(service.update(course.id, updateCourseDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a course by id', async () => {
      const result = await service.remove(course.id);
      expect(mockCourseRepository.findOne).toHaveBeenCalledWith({
        where: { id: course.id },
      });
      expect(mockCourseRepository.delete).toHaveBeenCalledWith(course.id);
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw NotFoundException if course to delete is not found', async () => {
      mockCourseRepository.findOne = jest.fn().mockResolvedValue(null);
      await expect(service.remove(course.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addCourseToUser', () => {
    it('should add a course to a user', async () => {
      const courseId = uuid();
      const userId = uuid();
      
      mockCourseRepository.findOne = jest.fn().mockResolvedValue(course);
      mockAuthService.findOne = jest.fn().mockResolvedValue(user);
      
      await service.addCourseToUser(courseId, userId);

      expect(mockCourseRepository.findOne).toHaveBeenCalledWith({ where: { id: courseId } });
      expect(mockAuthService.findOne).toHaveBeenCalledWith(userId);
      
    });

    it('should throw NotFoundException if course or user not found', async () => {
      const courseId = uuid();
      const userId = uuid();
      
      mockCourseRepository.findOne = jest.fn().mockResolvedValue(null);
      
      await expect(service.addCourseToUser(courseId, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createGroups', () => {
    it('should create groups for a course', async () => {
      const courseId = uuid();
      const users = [
        { id: uuid(), schedules: [{ day: 'Monday', hour_i: '10:00', hour_f: '12:00' }], skills: [{ name: 'Math' }] },
        { id: uuid(), schedules: [{ day: 'Monday', hour_i: '10:00', hour_f: '12:00' }], skills: [{ name: 'Physics' }] },
        { id: uuid(), schedules: [{ day: 'Tuesday', hour_i: '14:00', hour_f: '16:00' }], skills: [{ name: 'Chemistry' }] },
      ];

      mockUserRepository.find = jest.fn().mockResolvedValue(users);
      mockTeamRepository.save = jest.fn().mockResolvedValue({ id: uuid(), name: 'auto1', course: courseId });

      const result = await service.createGroups(courseId);

      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(mockTeamRepository.save).toHaveBeenCalled();
      expect(mockTeamService.addTeamToUser).toHaveBeenCalled();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should throw NotFoundException if no users found for course', async () => {
      const courseId = uuid();
      
      mockUserRepository.find = jest.fn().mockResolvedValue([]);
      
      await expect(service.createGroups(courseId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('generateAutomaticGroups', () => {
    it('should generate groups based on schedules and skills', async () => {
      const courseId = uuid();
      const users = [
        { id: uuid(), schedules: [{ day: 'Monday', hour_i: '10:00', hour_f: '12:00' }], skills: [{ name: 'Math' }] },
        { id: uuid(), schedules: [{ day: 'Monday', hour_i: '10:00', hour_f: '12:00' }], skills: [{ name: 'Physics' }] },
        { id: uuid(), schedules: [{ day: 'Tuesday', hour_i: '14:00', hour_f: '16:00' }], skills: [{ name: 'Chemistry' }] },
      ];

      mockUserRepository.find = jest.fn().mockResolvedValue(users);

      const result = await service.generateAutomaticGroups(courseId);

      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].length).toBeGreaterThanOrEqual(1);
    });

    it('should throw NotFoundException if course not found', async () => {
      const courseId = uuid();
      
      mockCourseRepository.findOne = jest.fn().mockResolvedValue(null);
      
      await expect(service.generateAutomaticGroups(courseId)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if no users found for course', async () => {
      const courseId = uuid();
      
      mockUserRepository.find = jest.fn().mockResolvedValue([]);
      
      await expect(service.generateAutomaticGroups(courseId)).rejects.toThrow(NotFoundException);
    });
  });
});