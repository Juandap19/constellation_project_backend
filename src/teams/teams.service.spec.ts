import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from './entities/teams.entity';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

describe('TeamsService', () => {
  let service: TeamsService;
  let repository: Repository<Team>;

  const mockTeam = {
    id: uuid(),
    name: 'Team A',
  };

  const mockTeamsRepository = {
    find: jest.fn().mockResolvedValue([mockTeam]),
    findOne: jest.fn().mockResolvedValue(mockTeam),
    save: jest.fn().mockResolvedValue(mockTeam),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: getRepositoryToken(Team),
          useValue: mockTeamsRepository,
        },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    repository = module.get<Repository<Team>>(getRepositoryToken(Team));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of teams', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockTeam]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a team by id', async () => {
      const result = await service.findOne(mockTeam.id);
      expect(result).toEqual(mockTeam);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: mockTeam.id } });
    });

    it('should throw NotFoundException if team not found', async () => {
      repository.findOne = jest.fn().mockResolvedValue(null);
      await expect(service.findOne(uuid())).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new team', async () => {
      const createTeamsDto = { name: 'Team B' };
      const result = await service.create(createTeamsDto);
      expect(result).toEqual(mockTeam);
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ name: createTeamsDto.name }));
    });
  });

  describe('update', () => {
    it('should update and return the updated team', async () => {
      const updateTeamsDto = { name: 'Updated Team' };

      mockTeamsRepository.findOne = jest.fn().mockResolvedValue(mockTeam);

      const result = await service.update(mockTeam.id, updateTeamsDto);
      expect(result).toEqual(mockTeam);
      expect(repository.update).toHaveBeenCalledWith(mockTeam.id, updateTeamsDto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: mockTeam.id } });
    });

    it('should throw NotFoundException if team not found during update', async () => {
      mockTeamsRepository.findOne = jest.fn().mockResolvedValue(null);

      const updateTeamsDto = { name: 'Non-existent Team' };
      await expect(service.update(uuid(), updateTeamsDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a team and return void', async () => {
      mockTeamsRepository.findOne = jest.fn().mockResolvedValue(mockTeam);

      const result = await service.remove(mockTeam.id);
      expect(result).toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(mockTeam.id);
    });

    it('should throw NotFoundException if team not found during remove', async () => {
      mockTeamsRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.remove(uuid())).rejects.toThrow(NotFoundException);
    });
  });

});
