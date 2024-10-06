import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException } from '@nestjs/common';

const mockAuthService = {
  createUser: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  loginUser: jest.fn(),
  readExcel: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test',
        last_name: 'User',
        user_code: 'TEST001',
        role: 'user',
      };
      mockAuthService.createUser.mockResolvedValue(createUserDto);

      expect(await controller.create(createUserDto)).toEqual(createUserDto);
      expect(mockAuthService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ id: 1, name: 'Test User' }];
      mockAuthService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = { id: 1, name: 'Test User' };
      mockAuthService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockAuthService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const result = { id: 1, ...updateUserDto };
      mockAuthService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateUserDto)).toEqual(result);
      expect(mockAuthService.update).toHaveBeenCalledWith('1', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = { id: 1, name: 'Deleted User' };
      mockAuthService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(mockAuthService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('loginUser', () => {
    it('should login a user', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'Password123',
      };
      const result = { access_token: 'mock_token' };
      mockAuthService.loginUser.mockResolvedValue(result);

      expect(await controller.loginUser(loginUserDto)).toEqual(result);
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(loginUserDto);
    });
  });
/*
  describe('uploadFile', () => {
    it('should process an uploaded file', async () => {
      const mockFile = {
        buffer: Buffer.from('mock file content'),
      } as Express.Multer.File;
      const mockData = [{ row1: 'data1' }, { row2: 'data2' }];
      mockAuthService.readExcel.mockReturnValue(mockData);

      const result = await controller.uploadFile(mockFile);

      expect(result).toEqual({ message: 'uploaded and processed', data: mockData });
      expect(mockAuthService.readExcel).toHaveBeenCalledWith(mockFile.buffer);
    });

    it('should throw BadRequestException if no file is uploaded', async () => {
      await expect(controller.uploadFile(undefined)).rejects.toThrow(BadRequestException);
    });
  });

  */
});