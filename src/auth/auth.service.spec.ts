import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(' createUser',() => {
    it('should create a teacher',() => {
        //Prepare user
        const createUserDto = {
            email: 'testing@gmail.com',
            password: '123456',
            name: 'teacherTest',
            last_name: 'teacherTesting',
            role: 'teacher',
            user_code: 'TEST001',  
        }

        //Create user
        const teacher = service.createUser(createUserDto);

        //Assertions
        expect(teacher).toBe(createUserDto);
        


    })
  })
});
