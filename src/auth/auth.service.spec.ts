import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { TeamsService } from '../teams/teams.service';
import { SkillsService } from '../skills/skills.service';
import { CoursesService } from '../courses/courses.service';

describe('AuthService', () => {
    let service: AuthService;
    let userRepository: Repository<Users>;
    let jwtService: JwtService;

    const mockUserRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
        findOneBy: jest.fn(),
        create: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    const mockTeamService = {
        findOne: jest.fn(),
        findAll: jest.fn(),
        addTeamToUser: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    const mockSkillsService = {
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    const mockCoursesService = {
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };
    

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: getRepositoryToken(Users), useValue: mockUserRepository },
                { provide: JwtService, useValue: mockJwtService },
                { provide: TeamsService, useValue: mockTeamService },
                { provide: SkillsService, useValue: mockSkillsService },
                { provide: CoursesService, useValue: mockCoursesService }, // Aquí se agrega el mock
            ],
        }).compile();
    

        service = module.get<AuthService>(AuthService);
        userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createUser', () => {
        it('should create and save a new user', async () => {
            const createUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password123',
                name: 'John',
                last_name: 'Doe',
                user_code: '1234',
                role: 'student',
            };

            const savedUser = { id: uuid(), ...createUserDto, password: createUserDto.password };

            mockUserRepository.save.mockResolvedValue(savedUser);

            const result = await service.createUser(createUserDto);

            expect(result.email).toEqual(savedUser.email);
        });

        it('should handle database errors', async () => {
            mockUserRepository.save.mockRejectedValue({ code: '23505' });
            const createUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password123',
                name: 'John',
                last_name: 'Doe',
                user_code: '1234',
                role: 'student',
            };

            await expect(service.createUser(createUserDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should return all users', async () => {
            const users = [
                { id: '1', email: 'test1@example.com', name: 'User1' },
                { id: '2', email: 'test2@example.com', name: 'User2' },
            ];

            mockUserRepository.find.mockResolvedValue(users);

            const result = await service.findAll();
            expect(result).toEqual(users);
            expect(mockUserRepository.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a user by id with relations', async () => {
            const user = { id: '1', email: 'test@example.com', user_code: '1234', skills: [], teams: [], courses: [] };
            mockUserRepository.findOne.mockResolvedValue(user);

            const result = await service.findOne('1');
            expect(result).toEqual(user);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { user_code: '1' },
                relations: ['skills', 'teams', 'courses'],
            });
        });

        it('should throw NotFoundException if user not found by id', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
        });

        it('should return a user by user_code with relations', async () => {
            const user = { id: '1', email: 'test@example.com', user_code: '1234', skills: [], teams: [], courses: [] };
            mockUserRepository.findOne.mockResolvedValue(user);

            const result = await service.findOne('1234');
            expect(result).toEqual(user);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { user_code: '1234' },
                relations: ['skills', 'teams', 'courses'],
            });
        });

        it('should throw NotFoundException if user not found by user_code', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne('1234')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a user by id', async () => {
            const updateUserDto = { email: 'updated@example.com' };
            const user = { id: '1', email: 'test@example.com', password: 'hashedpassword' };

            mockUserRepository.findOneBy.mockResolvedValue(user);
            mockUserRepository.save.mockResolvedValue(user);

            const result = await service.update('1', updateUserDto);
            expect(result).toEqual(user);
            expect(mockUserRepository.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException if user not found by id', async () => {
            mockUserRepository.findOneBy.mockResolvedValue(null);

            await expect(service.update('1', { email: 'updated@example.com' })).rejects.toThrow(NotFoundException);
        });

        it('should throw an error if database fails', async () => {
            mockUserRepository.findOneBy.mockResolvedValue({ id: '1', email: 'old@example.com' });
            mockUserRepository.save.mockRejectedValue(new InternalServerErrorException());

            await expect(service.update('1', { email: 'updated@example.com' })).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('remove', () => {
        it('should remove a user by id', async () => {
            const user = { id: '1', email: 'test@example.com' };

            mockUserRepository.findOneBy.mockResolvedValue(user);
            mockUserRepository.remove.mockResolvedValue(user);

            const result = await service.remove('1');
            expect(result).toEqual(user);
            expect(mockUserRepository.remove).toHaveBeenCalledWith(user);
        });

        it('should throw NotFoundException if user not found by id', async () => {
            mockUserRepository.findOneBy.mockResolvedValue(null);

            await expect(service.remove('1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('loginUser', () => {
        it('should return a JWT token for valid credentials', async () => {
            const loginUserDto = { email: 'test@example.com', password: 'password123' };
            const user = { id: '1', email: loginUserDto.email, password: bcrypt.hashSync(loginUserDto.password, 10) };

            mockUserRepository.findOne.mockResolvedValue(user);
            mockJwtService.sign.mockReturnValue('signedToken');

            const result = await service.loginUser(loginUserDto);
            expect(result).toEqual({ user_id: '1', email: 'test@example.com', token: 'signedToken' });
        });

        it('should throw UnauthorizedException for invalid credentials', async () => {
            const loginUserDto = { email: 'test@example.com', password: 'wrongpassword' };
            const user = { id: '1', email: loginUserDto.email, password: bcrypt.hashSync('password123', 10) };

            mockUserRepository.findOne.mockResolvedValue(user);

            await expect(service.loginUser(loginUserDto)).rejects.toThrow(UnauthorizedException);
        });
    });
});
