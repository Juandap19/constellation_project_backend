import { Test, TestingModule } from '@nestjs/testing';
import { CriteriaService } from './criteria.service';
import { NotFoundException } from '@nestjs/common';
import { RubricService } from '../rubric/rubric.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Criteria } from './entities/criteria.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

describe('CriteriaService', () => {
    let service: CriteriaService;
    let mockCriteriaRepository: Repository<Criteria>;
    let mockRubricService: Partial<RubricService>;

    const mockCriteria = {
        id: uuid(),
        name: 'Sample Criterion',
        rubric: { id: uuid(), name: 'Sample Rubric' },
    };

    beforeEach(async () => {
        mockCriteriaRepository = {
            create: jest.fn().mockReturnValue(mockCriteria),
            save: jest.fn().mockResolvedValue(mockCriteria),
            find: jest.fn().mockResolvedValue([mockCriteria]),
            findOne: jest.fn().mockResolvedValue(mockCriteria),
            remove: jest.fn().mockResolvedValue(undefined),
        } as unknown as Repository<Criteria>;

        mockRubricService = {
            findOne: jest.fn().mockResolvedValue({ id: uuid(), name: 'Sample Rubric' }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CriteriaService,
                { provide: getRepositoryToken(Criteria), useValue: mockCriteriaRepository },
                { provide: RubricService, useValue: mockRubricService },
            ],
        }).compile();

        service = module.get<CriteriaService>(CriteriaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a criterion', async () => {
            const createCriteriaDto = {
                name: 'New Criterion',
                rubric: mockCriteria.rubric.id,
                description: 'New Description',
                percentage: 10
            };

            const result = await service.create(createCriteriaDto);

            expect(mockRubricService.findOne).toHaveBeenCalledWith(createCriteriaDto.rubric);

            expect(mockCriteriaRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                name: createCriteriaDto.name,
                description: createCriteriaDto.description,
                percentage: createCriteriaDto.percentage,
            }));

            expect(result).toEqual(mockCriteria);
        });

    });

    describe('findAll', () => {
        it('should return an array of criteria', async () => {
            const result = await service.findAll();
            expect(mockCriteriaRepository.find).toHaveBeenCalled();
            expect(result).toEqual([mockCriteria]);
        });
    });

    describe('findOne', () => {
        it('should return a criterion by ID', async () => {
            const result = await service.findOne(mockCriteria.id);
            expect(mockCriteriaRepository.findOne).toHaveBeenCalledWith({
                where: { id: mockCriteria.id },
                relations: ['rubric'],
            });
            expect(result).toEqual(mockCriteria);
        });

        it('should throw NotFoundException if criterion is not found', async () => {
            mockCriteriaRepository.findOne = jest.fn().mockResolvedValue(null);
            await expect(service.findOne(mockCriteria.id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a criterion', async () => {
            const updateCriterionDto = { name: 'Updated Criterion', rubric: mockCriteria.rubric.id, description: 'Updated Description', percentage: 20 };
            const result = await service.update(mockCriteria.id, updateCriterionDto);
            expect(mockCriteriaRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                id: mockCriteria.id,
                name: updateCriterionDto.name,
            }));
            expect(result).toEqual(mockCriteria);
        });
    });

    describe('remove', () => {
        it('should remove a criterion by ID', async () => {
            const result = await service.remove(mockCriteria.id);
            expect(mockCriteriaRepository.findOne).toHaveBeenCalledWith({
                where: { id: mockCriteria.id },
                relations: ['rubric'],
            });
            expect(mockCriteriaRepository.remove).toHaveBeenCalledWith(mockCriteria);
            expect(result).toBeUndefined();
        });

        it('should throw NotFoundException if criterion not found for removal', async () => {
            mockCriteriaRepository.findOne = jest.fn().mockResolvedValue(null);
            await expect(service.remove(mockCriteria.id)).rejects.toThrow(NotFoundException);
        });
    });
});
