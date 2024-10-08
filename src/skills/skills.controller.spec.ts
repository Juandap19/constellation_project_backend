import { Test, TestingModule } from '@nestjs/testing';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

describe('SkillsController', () => {
  let controller: SkillsController;
  let skillsService: SkillsService;

  const mockSkillsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addSkillToUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsController],
      providers: [
        {
          provide: SkillsService,
          useValue: mockSkillsService,
        },
      ],
    }).compile();

    controller = module.get<SkillsController>(SkillsController);
    skillsService = module.get<SkillsService>(SkillsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new skill', async () => {
      const createSkillDto: CreateSkillDto = { name: 'New Skill', description: 'Description', users: '1' };
      mockSkillsService.create.mockResolvedValue(createSkillDto);

      const result = await controller.create(createSkillDto);
      expect(skillsService.create).toHaveBeenCalledWith(createSkillDto);
      expect(result).toEqual(createSkillDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of skills', async () => {
      const skills = [{ id: '1', name: 'Skill 1' }, { id: '2', name: 'Skill 2' }];
      mockSkillsService.findAll.mockResolvedValue(skills);

      const result = await controller.findAll();
      expect(skillsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(skills);
    });
  });

  describe('findOne', () => {
    it('should return a skill by id', async () => {
      const skill = { id: '1', name: 'Skill 1' };
      mockSkillsService.findOne.mockResolvedValue(skill);

      const result = await controller.findOne('1');
      expect(skillsService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(skill);
    });
  });

  describe('update', () => {
    it('should update an existing skill', async () => {
      const updateSkillDto: UpdateSkillDto = { name: 'Updated Skill' };
      const updatedSkill = { id: '1', ...updateSkillDto };
      mockSkillsService.update.mockResolvedValue(updatedSkill);

      const result = await controller.update('1', updateSkillDto);
      expect(skillsService.update).toHaveBeenCalledWith('1', updateSkillDto);
      expect(result).toEqual(updatedSkill);
    });
  });

  describe('remove', () => {
    it('should remove a skill by id', async () => {
      const skillId = '1';
      mockSkillsService.remove.mockResolvedValue({ id: skillId });

      const result = await controller.remove(skillId);
      expect(skillsService.remove).toHaveBeenCalledWith(skillId);
      expect(result).toEqual({ id: skillId });
    });
  });

  describe('addSkillToUser', () => {
    it('should add a skill to a user', async () => {
      const skillId = '1';
      const userId = 'user-id';
      const result = { skillId, userId };

      mockSkillsService.addSkillToUser.mockResolvedValue(result);

      const response = await controller.addSkillToUser(skillId, userId);
      expect(skillsService.addSkillToUser).toHaveBeenCalledWith(skillId, userId);
      expect(response).toEqual(result);
    });
  });
});
