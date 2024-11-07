import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRubricGradeDto } from './dto/create-rubric_grade.dto';
import { UpdateRubricGradeDto } from './dto/update-rubric_grade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RubricGrade } from './entities/rubric_grade.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CriteriaService } from '../criteria/criteria.service';
import { AuthService } from '../auth/auth.service';
import { RubricService } from '../rubric/rubric.service';
import { CriteriaGrade } from '../criteria_grade/entities/criteria_grade.entity';

@Injectable()
export class RubricGradeService {

  constructor(@InjectRepository (RubricGrade) private readonly rubricGradeRepository: Repository<RubricGrade>,
  @InjectRepository(CriteriaGrade) private criteriaGradeRepository: Repository<CriteriaGrade>,
  private readonly rubricService: RubricService,
  private readonly authService: AuthService,
  ) {}

  async create(createRubricGradeDto: CreateRubricGradeDto) {

    const rubric = await this.rubricService.findOne(createRubricGradeDto.rubric);
    const studentEval = await this.authService.findOne(createRubricGradeDto.studentEval);

    const { id: idEval, ...userDataEval } = studentEval;
  
    const grade = await this.calculateRubricGrade(idEval, rubric.id);

    console.log(grade);

    const rubricGrade = Object.assign({...createRubricGradeDto, id: uuid(), rubric, idEval, grade});
    return await this.rubricGradeRepository.save(rubricGrade);
  }

  async findAll() {
    return await this.rubricGradeRepository.find();
  }

  async findOne(id: string) {
    const rubricGrade = await this.rubricGradeRepository.findOne({ where: { id }, relations: ['rubric'] });
    if (!rubricGrade) {
      throw new NotFoundException(`Rubric grade with ID ${id} not found`);
    }
    return rubricGrade;
  }

  async update(id: string, updateRubricGradeDto: UpdateRubricGradeDto) {
    const rubricGrade = await this.findOne(id);
    Object.assign(rubricGrade, updateRubricGradeDto);
    return await this.rubricGradeRepository.save(rubricGrade);
  }

  async remove(id: string) {
    const rubricGrade = await this.findOne(id);
    await this.rubricGradeRepository.remove(rubricGrade);
  }

  async calculateRubricGrade(studentId: string, rubricId: string): Promise<number> {
    // Paso 1: Agrupar las notas de cada evaluador para el estudiante evaluado
    const gradesByEvaluator: { [evaluator: string]: { grade: number; percentage: number }[] } = {};

    // Obtener las notas de los criterios desde el repositorio
    const criteriaGrades = await this.criteriaGradeRepository.find({ where: { studentEval: studentId }, relations: ['criteria', 'criteria.rubric'] });

    // Llenar el objeto gradesByEvaluator con las notas de cada evaluador
    criteriaGrades.forEach((criteriaGrade) => {
        const evaluatorId = criteriaGrade.studentEval;
        if (!gradesByEvaluator[evaluatorId]) {
            gradesByEvaluator[evaluatorId] = [];
        }
        gradesByEvaluator[evaluatorId].push({
            grade: criteriaGrade.grade,
            percentage: criteriaGrade.criteria.percentage,
        });
    });

    // Paso 2: Calcular el promedio ponderado para cada evaluador
    const evaluatorAverages: { [evaluator: string]: number } = {};

    for (const evaluator in gradesByEvaluator) {
        const grades = gradesByEvaluator[evaluator];
        let totalWeightedGrade = 0;
        let totalPercentage = 0;

        grades.forEach((gradeEntry) => {
            const weight = gradeEntry.percentage / 100;
            totalWeightedGrade += gradeEntry.grade * weight;
            totalPercentage += weight;
        });

        // Calcular el promedio ponderado para este evaluador
        if (totalPercentage > 0) {
            evaluatorAverages[evaluator] = totalWeightedGrade / totalPercentage;
        } else {
            evaluatorAverages[evaluator] = 0; // Evitar división por cero
        }
    }

    // Paso 3: Calcular la nota final del estudiante evaluado promediando las notas de cada evaluador
    const finalGrade =
        Object.values(evaluatorAverages).reduce((acc, avg) => acc + avg, 0) / Object.keys(evaluatorAverages).length;

    return finalGrade; // Devolver la nota final del estudiante evaluado

  }

}
