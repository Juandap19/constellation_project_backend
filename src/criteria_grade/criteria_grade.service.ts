import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCriteriaGradeDto } from './dto/create-criteria_grade.dto';
import { UpdateCriteriaGradeDto } from './dto/update-criteria_grade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CriteriaGrade } from './entities/criteria_grade.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CriteriaService } from '../criteria/criteria.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class CriteriaGradeService {

  constructor(@InjectRepository (CriteriaGrade) private readonly criteriaGradeRepository: Repository<CriteriaGrade>, 
  private readonly criteriaService: CriteriaService,
  private readonly authService: AuthService) {}

  async create(createCriteriaGradeDto: CreateCriteriaGradeDto) {
    const criteria = await this.criteriaService.findOne(createCriteriaGradeDto.criteria);
    const student = await this.authService.findOne(createCriteriaGradeDto.student);
    const studentEval = await this.authService.findOne(createCriteriaGradeDto.studentEval);

    const { id: idStu, ...userData } = student;
    const { id: idEval, ...userDataEval } = studentEval;

    const criteriaGrade = Object.assign({...createCriteriaGradeDto, id: uuid(), criteria, idStu, idEval});
    return await this.criteriaGradeRepository.save(criteriaGrade);
  }

  async findAll() {
    return await this.criteriaGradeRepository.find({ relations: ['criteria'] });
  }

  async findOne(id: string) {
    const criteriaGrade = await this.criteriaGradeRepository.findOne({ where: { id }});
    if (!criteriaGrade) {
      throw new NotFoundException(`Criteria grade with ID ${id} not found`);
    }
    return criteriaGrade;;
  }

  async update(id: string, updateCriteriaGradeDto: UpdateCriteriaGradeDto) {
    const criteriaGrade = await this.findOne(id);
    if (!criteriaGrade) {
      throw new NotFoundException(`Criteria grade with ID ${id} not found`);
    }
    Object.assign(criteriaGrade, updateCriteriaGradeDto);
    return await this.criteriaGradeRepository.save(criteriaGrade);
  }

  async remove(id: string) {
    const criteriaGrade = await this.findOne(id);
    await this.criteriaGradeRepository.remove(criteriaGrade);
  }
}
