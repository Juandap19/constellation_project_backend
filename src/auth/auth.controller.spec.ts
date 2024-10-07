import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

describe('AuthController', () => {
    let controller: AuthController;

    const mockAuthService = {
        createUser: jest.fn((createUserDto: any) => ({
            id: 1,
            email: createUserDto.email,
            name: createUserDto.name,
        })),
        findAll: jest.fn(() => [
            { id: 1, email: 'user1@example.com', name: 'User1' },
            { id: 2, email: 'user2@example.com', name: 'User2' },
        ]),
        findOne: jest.fn((id: string) => ({
            id,
            email: 'user1@gmail.com',
            name: 'User1',
            user_code: 'TEST001',
            role: 'teacher',
        })),
        update: jest.fn((id: string, dto: any) => ({ id, ...dto })),
        remove: jest.fn((id: string) => ({ id, email: 'usertest@gmail.com', name: 'usertest' })),
        loginUser: jest.fn((loginUserDto: any) => ({ token: 'mockToken' })),
        readExcel: jest.fn((fileBuffer: Buffer) => ({ message: 'processed' })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService],
        })
            .overrideProvider(AuthService)
            .useValue(mockAuthService)
            .compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a user and return the user object', () => {
        const createUserDto = {
            email: 'test@gmail.com',
            password: 'test123',
            name: 'testing1',
            last_name: 'tester',
            user_code: 'TEST001',
            role: 'teacher',
        };

        const result = controller.create(createUserDto);

        expect(mockAuthService.createUser).toHaveBeenCalledWith(createUserDto);
        expect(result).toEqual({ id: 1, email: 'test@gmail.com', name: 'testing1' });
    });

    it('should return all users', () => {
        const result = controller.findAll();

        expect(mockAuthService.findAll).toHaveBeenCalled();

        expect(result).toEqual([
            { id: 1, email: 'user1@example.com', name: 'User1' },
            { id: 2, email: 'user2@example.com', name: 'User2' },
        ]);
    });

    it('should return a user by id', () => {
        const result = controller.findOne('1');
    
        expect(mockAuthService.findOne).toHaveBeenCalledWith('1');
        expect(result).toEqual({ 
            id: '1',
            email: 'user1@gmail.com',
            name: 'User1',
            user_code: 'TEST001',
            role: 'teacher' 
        });
    });

    it('should update a user', () => {
        const dto = { name: 'User1' };

        expect(controller.update('1', dto)).toEqual({
            id: "1",
            ...dto
        });

        expect(mockAuthService.update).toHaveBeenCalledWith('1', dto);
    });

    it('should delete a user', () => {
        const result = controller.remove('1');
    
        expect(mockAuthService.remove).toHaveBeenCalledWith('1');
        expect(result).toEqual({ 
            id: '1',
            email: 'usertest@gmail.com',
            name: 'usertest' 
        });
    });

    it('should log in a user and return a token', () => {
        const loginUserDto = { email: 'test@gmail.com', password: 'test123' };

        const result = controller.loginUser(loginUserDto);

        expect(mockAuthService.loginUser).toHaveBeenCalledWith(loginUserDto);
        expect(result).toEqual({ token: 'mockToken' });
    });

    it('should upload a file and process it', () => {
        const mockFile = {
            buffer: Buffer.from('file content'),
        } as Express.Multer.File;

        const result = controller.uploadFile(mockFile);

        expect(mockAuthService.readExcel).toHaveBeenCalledWith(mockFile.buffer);
        expect(result).toEqual({ message: 'uploaded and processed', data: { message: 'processed' } });
    });

    it('should throw a BadRequestException if no file is uploaded', () => {
        expect(() => controller.uploadFile(null)).toThrow(BadRequestException);
    });
});
