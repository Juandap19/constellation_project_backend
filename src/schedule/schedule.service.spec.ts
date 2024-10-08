import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { NotFoundException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { v4 as uuid } from 'uuid';

describe('ScheduleService', () => {
    let service: ScheduleService;
    let scheduleRepository;
    let authService;

    const mockScheduleRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
        findOneBy: jest.fn(),
        remove: jest.fn(),
    };

    const mockAuthService = {
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ScheduleService,
                {
                    provide: getRepositoryToken(Schedule),
                    useValue: mockScheduleRepository,
                },
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        service = module.get<ScheduleService>(ScheduleService);
        scheduleRepository = module.get(getRepositoryToken(Schedule));
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new schedule', async () => {
            const scheduleDto: CreateScheduleDto = {
                user: 'user-id',
                day: 'Monday',
                hour_i: '08:00',
                hour_f: '10:00',
                state: true,
            };
            const user = { id: 'user-id' };
            const newSchedule = { ...scheduleDto, id: uuid() };

            mockAuthService.findOne.mockResolvedValue(user);
            mockScheduleRepository.save.mockResolvedValue(newSchedule);

            const result = await service.create(scheduleDto);
            expect(authService.findOne).toHaveBeenCalledWith(scheduleDto.user);
            expect(scheduleRepository.save).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String) }));
            expect(result).toEqual(newSchedule);
        });
    });

    describe('findAll', () => {
        it('should return an array of schedules', async () => {
            const schedules = [{ id: 'schedule1' }, { id: 'schedule2' }];
            mockScheduleRepository.find.mockResolvedValue(schedules);

            const result = await service.findAll();
            expect(scheduleRepository.find).toHaveBeenCalled();
            expect(result).toEqual(schedules);
        });
    });

    describe('findOne', () => {
        it('should return a schedule by id', async () => {

            const scheduleDto: CreateScheduleDto = {
                user: 'user-id',
                day: 'Monday',
                hour_i: '08:00',
                hour_f: '10:00',
                state: true,
            };

            const newSchedule = { ...scheduleDto, id: uuid() };
            const scheduleID = { id: newSchedule.id };
            mockScheduleRepository.findOneBy.mockResolvedValue(scheduleID);

            const result = await service.findOne(newSchedule.id);
            expect(scheduleRepository.findOneBy).toHaveBeenCalledWith({ id: newSchedule.id  });
            expect(result).toEqual(scheduleID);
        });

        it('should throw NotFoundException if schedule not found', async () => {
            mockScheduleRepository.findOneBy.mockResolvedValue(null);

            await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update an existing schedule', async () => {
            const scheduleDto: CreateScheduleDto = {
                user: 'user-id',
                day: 'Monday',
                hour_i: '08:00',
                hour_f: '10:00',
                state: true,
            };

            const newSchedule = { ...scheduleDto, id: uuid() };
            const scheduleID = { id: newSchedule.id };
            const updatedSchedule = { ...scheduleDto, name: 'Updated Schedule' };
            mockScheduleRepository.findOneBy.mockResolvedValue(scheduleID);
            mockScheduleRepository.save.mockResolvedValue(updatedSchedule);

            const result = await service.update(newSchedule.id, { day: 'Monday' });
            expect(scheduleRepository.findOneBy).toHaveBeenCalledWith({ id: newSchedule.id });
            expect(scheduleRepository.save).toHaveBeenCalledWith(expect.objectContaining({ id: newSchedule.id }));
            expect(result).toEqual(updatedSchedule);
        });

        it('should throw NotFoundException if schedule not found', async () => {
            mockScheduleRepository.findOneBy.mockResolvedValue(null);

            await expect(service.update('invalid-id', { day: 'Tuesday' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a schedule by id', async () => {
            const schedule = { id: 'valid-id' };
            mockScheduleRepository.findOne.mockResolvedValue(schedule);
            mockScheduleRepository.remove.mockResolvedValue(schedule);

            const result = await service.remove('valid-id');
            expect(scheduleRepository.findOne).toHaveBeenCalledWith({ where: [{ id: 'valid-id' }] });
            expect(scheduleRepository.remove).toHaveBeenCalledWith(schedule);
            expect(result).toEqual(schedule);
        });

        it('should throw NotFoundException if schedule not found', async () => {
            mockScheduleRepository.findOne.mockResolvedValue(null);

            await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
        });
    });
});