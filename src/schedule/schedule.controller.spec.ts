import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

describe('ScheduleController', () => {
  let controller: ScheduleController;
  let service: ScheduleService;

  const mockScheduleService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockScheduleRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [
        ScheduleService,
        {
          provide: getRepositoryToken(Schedule),
          useValue: mockScheduleRepository,
        },
      ],
    })
    .overrideProvider(ScheduleService).useValue(mockScheduleService)
    .compile();

    controller = module.get<ScheduleController>(ScheduleController);
    service = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service create with the correct DTO', async () => {
      const createScheduleDto: CreateScheduleDto = {
        day: 'Monday',
        hour_i: '08:00',
        hour_f: '10:00',
        state: true,
        user: '1',
      };
      await controller.create(createScheduleDto);
      expect(mockScheduleService.create).toHaveBeenCalledWith(createScheduleDto);
    });

    it('should return the result from the service', async () => {
      const createScheduleDto: CreateScheduleDto = {
        day: 'Monday',
        hour_i: '08:00',
        hour_f: '10:00',
        state: true,
        user: '1',
      };
      const result = { id: '123', ...createScheduleDto };
      mockScheduleService.create.mockReturnValue(result);

      const response = await controller.create(createScheduleDto);
      expect(response).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all schedules from the service', async () => {
      const schedules = [{ id: '1', day: 'Monday' }, { id: '2', day: 'Tuesday' }];
      mockScheduleService.findAll.mockReturnValue(schedules);

      const response = await controller.findAll();
      expect(response).toEqual(schedules);
      expect(mockScheduleService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service findOne with correct ID', async () => {
      const id = '1';
      await controller.findOne(id);
      expect(mockScheduleService.findOne).toHaveBeenCalledWith(id);
    });

    it('should return the schedule from the service', async () => {
      const id = '1';
      const schedule = { id, day: 'Monday' };
      mockScheduleService.findOne.mockReturnValue(schedule);

      const response = await controller.findOne(id);
      expect(response).toEqual(schedule);
    });
  });

  describe('update', () => {
    it('should call service update with the correct ID and DTO', async () => {
      const id = '1';
      const updateScheduleDto: UpdateScheduleDto = { day: 'Tuesday' };
      await controller.update(id, updateScheduleDto);
      expect(mockScheduleService.update).toHaveBeenCalledWith(id, updateScheduleDto);
    });

    it('should return the updated schedule from the service', async () => {
      const id = '1';
      const updateScheduleDto: UpdateScheduleDto = { day: 'Tuesday' };
      const updatedSchedule = { id, day: 'Tuesday' };
      mockScheduleService.update.mockReturnValue(updatedSchedule);

      const response = await controller.update(id, updateScheduleDto);
      expect(response).toEqual(updatedSchedule);
    });
  });

  describe('remove', () => {
    it('should call service remove with the correct ID', async () => {
      const id = '1';
      await controller.remove(id);
      expect(mockScheduleService.remove).toHaveBeenCalledWith(id);
    });

    it('should return the result from the service', async () => {
      const id = '1';
      const result = { deleted: true };
      mockScheduleService.remove.mockReturnValue(result);

      const response = await controller.remove(id);
      expect(response).toEqual(result);
    });
  });
});
