import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from './entities/teams.entity';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { Users } from '../auth/entities/user.entity';

describe('TeamsService', () => {
  let service: TeamsService;
  let repository: Repository<Team>;
  let authService: AuthService;

  const mockUser = {
    id: uuid(),
    name: 'User A',
    teams: [],
  } as Users;

  const mockTeam = {
    id: uuid(),
    name: 'Team A',
    users: [mockUser],
  } as Team;

  const mockTeamsRepository = {
    find: jest.fn().mockResolvedValue([mockTeam]),
    findOne: jest.fn().mockResolvedValue(mockTeam),
    save: jest.fn().mockResolvedValue(mockTeam),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockAuthService = {
    findOne: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: getRepositoryToken(Team),
          useValue: mockTeamsRepository,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    repository = module.get<Repository<Team>>(getRepositoryToken(Team));
    authService = module.get<AuthService>(AuthService);
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
      const createTeamsDto = { name: 'Team B', users: '1' };
      mockAuthService.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await service.create(createTeamsDto);
      expect(result).toEqual(mockTeam);
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ name: createTeamsDto.name }));
    });
  });

  describe('update', () => {
    it('should update and return the updated team', async () => {
      const updateTeamsDto = { 
        id: mockTeam.id, 
        name: 'Updated Team',
        users: '1',
      };
  
      mockTeamsRepository.findOne = jest.fn().mockResolvedValue(mockTeam);
  
      const result = await service.update(mockTeam.id, updateTeamsDto);
      expect(result).toEqual(mockTeam);
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(updateTeamsDto));
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: mockTeam.id } });
    });
  
    it('should throw NotFoundException if team not found during update', async () => {
      mockTeamsRepository.findOne = jest.fn().mockResolvedValue(null);
  
      const updateTeamsDto = { 
        id: uuid(),
        name: 'Non-existent Team',
        users: '1',
      };
      
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

  describe('addTeamToUser', () => {
    it('should add a team to a user and return the updated user', async () => {
      mockTeamsRepository.findOne = jest.fn().mockResolvedValue(mockTeam);
      mockAuthService.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await service.addTeamToUser(mockTeam.id, mockUser.id);
      expect(result).toEqual(mockUser);
      expect(mockAuthService.update).toHaveBeenCalledWith(mockUser.id, expect.objectContaining({
        teams: expect.arrayContaining([mockTeam]),
      }));
    });

    it('should throw NotFoundException if team or user not found', async () => {
      mockTeamsRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.addTeamToUser(uuid(), mockUser.id)).rejects.toThrow(NotFoundException);
      await expect(service.addTeamToUser(mockTeam.id, uuid())).rejects.toThrow(NotFoundException);
    });
  });
});
