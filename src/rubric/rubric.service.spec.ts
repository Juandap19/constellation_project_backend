import { Test, TestingModule } from '@nestjs/testing';
import { RubricService } from './rubric.service';

describe('RubricService', () => {
  let service: RubricService;

  const mockRubricService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RubricService],
    }).overrideProvider(RubricService).useValue(mockRubricService).compile();

    service = module.get<RubricService>(RubricService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

