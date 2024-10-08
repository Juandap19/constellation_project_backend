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
      const result = [{
        id: '1',
        name: 'Team 1',
        users: [], 
        course: {}
      }];

      (mockTeamsService.findAll as jest.Mock).mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockTeamsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single team by id', async () => {
      const team = { id: '1', name: 'Team 1', users: [], course: {} };

      (mockTeamsService.findOne as jest.Mock).mockResolvedValue(team);

      expect(await controller.findOne('1')).toBe(team);
      expect(mockTeamsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new team', async () => {
      const createTeamsDto: CreateTeamsDto = { name: 'New Team', users: '1' };
      const createdTeam = { id: '1', ...createTeamsDto, users: [], course: {} };

      (mockTeamsService.create as jest.Mock).mockResolvedValue(createdTeam);

      expect(await controller.create(createTeamsDto)).toBe(createdTeam);
      expect(mockTeamsService.create).toHaveBeenCalledWith(createTeamsDto);
    });
  });

  describe('update', () => {
    it('should update a team by id', async () => {
      const createTeam: CreateTeamsDto = { name: 'Updated Team', users: '1' }
      const updateTeamsDto = {id: '1', ...createTeam};
      const updatedTeam = { id: '1', ...updateTeamsDto, users: [], course: {} };

      (mockTeamsService.update as jest.Mock).mockResolvedValue(updatedTeam);

      expect(await controller.update('1', updateTeamsDto)).toBe(updatedTeam);
      expect(mockTeamsService.update).toHaveBeenCalledWith('1', updateTeamsDto);
    });
  });

  describe('remove', () => {
    it('should delete a team by id', async () => {
      (mockTeamsService.remove as jest.Mock).mockResolvedValue(undefined);

      await expect(controller.remove('1')).resolves.toBeUndefined();
      expect(mockTeamsService.remove).toHaveBeenCalledWith('1');
    });
  });
});
