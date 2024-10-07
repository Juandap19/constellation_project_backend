import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

describe('CoursesService', () => {
  let service: CoursesService;
  let mockCourseRepository: Partial<Repository<Course>>;

  const course = { id: uuid(), name: 'Math 101', description: 'Basic math' };

  beforeEach(async () => {
    mockCourseRepository = {
      find: jest.fn().mockResolvedValue([course]),
      findOne: jest.fn().mockResolvedValue(course),
      create: jest.fn().mockReturnValue(course),
      save: jest.fn().mockResolvedValue(course),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: getRepositoryToken(Course), useValue: mockCourseRepository },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new course', async () => {
      const createCourseDto = { id:'1', name: 'Math 101', description: 'Basic math' };
      const result = await service.create(createCourseDto);

      expect(mockCourseRepository.create).toHaveBeenCalledWith({
        ...createCourseDto,
        id: expect.any(String),
      });
      expect(mockCourseRepository.save).toHaveBeenCalledWith(course);
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
      const updateCourseDto = { id:course.id, name: 'Math 102' };
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
      const updateCourseDto = { id:'14', name: 'Math 102' };

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
});
