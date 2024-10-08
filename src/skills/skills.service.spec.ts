import { Test, TestingModule } from '@nestjs/testing';
import { SkillsService } from './skills.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Skills } from './entities/skill.entity';
import { AuthService } from '../auth/auth.service';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

describe('SkillsService', () => {
    let service: SkillsService;
    let skillRepository;
    let authService;

    const mockSkillsRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
    };

    const mockAuthService = {
        findOne: jest.fn(),
        update: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SkillsService,
                {
                    provide: getRepositoryToken(Skills),
                    useValue: mockSkillsRepository,
                },
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        service = module.get<SkillsService>(SkillsService);
        skillRepository = module.get(getRepositoryToken(Skills));
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new skill', async () => {
            const skillDto = { name: 'New Skill', users: 'user-id', description: 'description' };
            const user = { id: 'user-id', skills: [] };
            const newSkill = { ...skillDto, id: uuid(), users: user };

            mockAuthService.findOne.mockResolvedValue(user);
            mockSkillsRepository.save.mockResolvedValue(newSkill);

            const result = await service.create(skillDto);
            expect(authService.findOne).toHaveBeenCalledWith(skillDto.users);
            expect(skillRepository.save).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String) }));
            expect(result).toEqual(newSkill);
        });
    });

    describe('findAll', () => {
        it('should return an array of skills', async () => {
            const skills = [{ id: '1', name: 'Skill 1' }, { id: '2', name: 'Skill 2' }];
            mockSkillsRepository.find.mockResolvedValue(skills);

            const result = await service.findAll();
            expect(skillRepository.find).toHaveBeenCalledWith({ relations: ['users'] });
            expect(result).toEqual(skills);
        });
    });

    describe('findOne', () => {
        it('should return a skill by id', async () => {
            const skillDto = { name: 'New Skill', users: 'user-id', description: 'description' };

            const user = { id: 'user-id', skills: [] };
            const skill = { ...skillDto, id: uuid(), users: user };

            mockSkillsRepository.findOne.mockResolvedValue(skill);

            const result = await service.findOne(skill.id);
            expect(skillRepository.findOne).toHaveBeenCalledWith({ where: { id: skill.id } });
            expect(result).toEqual(skill);
        });

        it('should throw NotFoundException if skill not found', async () => {
            mockSkillsRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update an existing skill', async () => {
            const skill = { id: 'valid-id', name: 'Old Skill' };
            const updateSkillDto = { name: 'Updated Skill' };
            const updatedSkill = { ...skill, ...updateSkillDto };

            mockSkillsRepository.findOne.mockResolvedValue(skill);
            mockSkillsRepository.save.mockResolvedValue(updatedSkill);

            const result = await service.update('valid-id', updateSkillDto);
            expect(skillRepository.findOne).toHaveBeenCalledWith({ where: [{ id: 'valid-id' }] });
            expect(skillRepository.save).toHaveBeenCalledWith(expect.objectContaining({ id: 'valid-id', ...updateSkillDto }));
            expect(result).toEqual(updatedSkill);
        });

        it('should throw NotFoundException if skill not found', async () => {
            mockSkillsRepository.findOne.mockResolvedValue(null);

            await expect(service.update('invalid-id', { name: 'New Skill' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a skill by id', async () => {
            const skill = { id: 'valid-id', name: 'Skill to Remove' };
            mockSkillsRepository.findOne.mockResolvedValue(skill);
            mockSkillsRepository.remove.mockResolvedValue(skill);

            const result = await service.remove('valid-id');
            expect(skillRepository.findOne).toHaveBeenCalledWith({ where: [{ id: 'valid-id' }] });
            expect(skillRepository.remove).toHaveBeenCalledWith(skill);
            expect(result).toEqual(skill);
        });

        it('should throw NotFoundException if skill not found', async () => {
            mockSkillsRepository.findOne.mockResolvedValue(null);

            await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('addSkillToUser', () => {
        it('should add a skill to a user', async () => {
            const skillId = 'valid-skill-id';
            const userId = 'valid-user-id';
            const skill = { id: skillId, name: 'Skill 1' };
            const user = { id: userId, skills: [] };

            mockSkillsRepository.findOne.mockResolvedValue(skill);
            mockAuthService.findOne.mockResolvedValue(user);
            mockAuthService.update.mockResolvedValue({ ...user, skills: [skill] });

            const result = await service.addSkillToUser(skillId, userId);
            expect(skillRepository.findOne).toHaveBeenCalledWith({ where: { id: skillId } });
            expect(authService.findOne).toHaveBeenCalledWith(userId);
            expect(authService.update).toHaveBeenCalledWith(userId, { ...user, skills: [skill] });
            expect(result).toEqual({ ...user, skills: [skill] });
        });

        it('should throw NotFoundException if skill or user not found', async () => {
            const skillId = 'invalid-skill-id';
            const userId = 'valid-user-id';

            mockSkillsRepository.findOne.mockResolvedValue(null);
            mockAuthService.findOne.mockResolvedValue({ id: userId });

            await expect(service.addSkillToUser(skillId, userId)).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException if user not found', async () => {
            const skillId = 'valid-skill-id';
            const userId = 'invalid-user-id';

            mockSkillsRepository.findOne.mockResolvedValue({ id: skillId });
            mockAuthService.findOne.mockResolvedValue(null);

            await expect(service.addSkillToUser(skillId, userId)).rejects.toThrow(NotFoundException);
        });
    });
});
