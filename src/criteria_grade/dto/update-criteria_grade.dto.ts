import { PartialType } from '@nestjs/mapped-types';
import { CreateCriteriaGradeDto } from './create-criteria_grade.dto';
import { IsInt, IsNotEmpty, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class UpdateCriteriaGradeDto extends PartialType(CreateCriteriaGradeDto) {

    @IsUUID()
    @IsOptional()
    readonly criteria: string;
  
    @IsUUID()
    @IsOptional()
    readonly student: string;
  
    @IsUUID()
    @IsOptional()
    readonly studentEval: string;
  
    @IsNotEmpty({ message: 'El campo "grade" no debe estar vacío.' })
    @IsInt({ message: 'El campo "grade" debe ser un número entero.' })
    @Min(0, { message: 'El campo "grade" debe ser al menos 0.' })
    @Max(5, { message: 'El campo "grade" no debe ser mayor que 5.' })
    @IsOptional()
    grade: number;
}
