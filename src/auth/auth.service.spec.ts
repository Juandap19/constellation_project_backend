import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: getRepositoryToken(Users), useValue: mockUserRepository },
                { provide: JwtService, useValue: mockJwtService },
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

            const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);
            const savedUser = { id: 'uuid', ...createUserDto, password: hashedPassword };

            mockUserRepository.create.mockReturnValue(savedUser);
            mockUserRepository.save.mockResolvedValue(savedUser);

            const result = await service.createUser(createUserDto);
            expect(result).toEqual(savedUser);
            expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                password: expect.any(String),
            }));
            expect(mockUserRepository.save).toHaveBeenCalled();
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

    describe('findOne', () => {
        it('should return a user by id', async () => {
            const user = { id: '1', email: 'test@example.com', user_code: '1234' };
            mockUserRepository.findOneBy.mockResolvedValue(user);

            const result = await service.findOne('1');
            expect(result).toEqual(user);
            expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ user_code: '1' });
        });


        it('should throw NotFoundException if user not found', async () => {
            mockUserRepository.findOneBy.mockResolvedValue(null);

            await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
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

        it('should throw NotFoundException if user not found', async () => {
            mockUserRepository.findOneBy.mockResolvedValue(null);

            await expect(service.update('1', { email: 'updated@example.com' })).rejects.toThrow(NotFoundException);
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


        it('should throw NotFoundException if user not found', async () => {
            mockUserRepository.findOneBy.mockResolvedValue(null);

            await expect(service.remove('1')).rejects.toThrow(NotFoundException);
        });
    });
});
