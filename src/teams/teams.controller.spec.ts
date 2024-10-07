import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { CreateTeamsDto } from './dto/create-teams.dto';

describe('TeamsController', () => {
  let controller: TeamsController;
  let mockTeamsService: Partial<TeamsService>;

  beforeEach(async () => {
    mockTeamsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamsService],
      controllers: [TeamsController],
    })
      .overrideProvider(TeamsService)
      .useValue(mockTeamsService)
      .compile();

    controller = module.get<TeamsController>(TeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of teams', async () => {
      const result = [{ id: '1', name: 'Team 1' }];
      jest.spyOn(mockTeamsService, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockTeamsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single team by id', async () => {
      const team = { id: '1', name: 'Team 1' };
      jest.spyOn(mockTeamsService, 'findOne').mockResolvedValue(team);

      expect(await controller.findOne('1')).toBe(team);
      expect(mockTeamsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new team', async () => {
      const createTeamsDto: CreateTeamsDto = { name: 'New Team' };
      const createdTeam = { id: '1', ...createTeamsDto };
      jest.spyOn(mockTeamsService, 'create').mockResolvedValue(createdTeam);

      expect(await controller.create(createTeamsDto)).toBe(createdTeam);
      expect(mockTeamsService.create).toHaveBeenCalledWith(createTeamsDto);
    });
  });

  describe('update', () => {
    it('should update a team by id', async () => {
      const updateTeamsDto: CreateTeamsDto = { name: 'Updated Team' };
      const updatedTeam = { id: '1', ...updateTeamsDto };
      jest.spyOn(mockTeamsService, 'update').mockResolvedValue(updatedTeam);

      expect(await controller.update('1', updateTeamsDto)).toBe(updatedTeam);
      expect(mockTeamsService.update).toHaveBeenCalledWith('1', updateTeamsDto);
    });
  });

  describe('remove', () => {
    it('should delete a team by id', async () => {
      jest.spyOn(mockTeamsService, 'remove').mockResolvedValue(undefined);
  
      await expect(controller.remove('1')).resolves.toBeUndefined();
      expect(mockTeamsService.remove).toHaveBeenCalledWith('1');
    });
  });
  
});
