import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;

  const mockCoursesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [CoursesService],
    }).overrideProvider(CoursesService).useValue(mockCoursesService).compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new course', async () => {
      const createCourseDto: CreateCourseDto = { id:'1',name: 'Test Course' };
      mockCoursesService.create.mockResolvedValue(createCourseDto);

      expect(await controller.create(createCourseDto)).toBe(createCourseDto);
      expect(mockCoursesService.create).toHaveBeenCalledWith(createCourseDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const result = [{ id: '1', name: 'Test Course' }];
      mockCoursesService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single course', async () => {
      const result = { id: '1', name: 'Test Course' };
      mockCoursesService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(mockCoursesService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const updateCourseDto: UpdateCourseDto = { id:'1', name: 'Updated Course' };
      const result = { id: '1', ...updateCourseDto };
      mockCoursesService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateCourseDto)).toBe(result);
      expect(mockCoursesService.update).toHaveBeenCalledWith('1', updateCourseDto);
    });
  });

  describe('remove', () => {
    it('should remove a course', async () => {
      const result = { id: '1', name: 'Deleted Course' };
      mockCoursesService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
      expect(mockCoursesService.remove).toHaveBeenCalledWith('1');
    });
  });
});