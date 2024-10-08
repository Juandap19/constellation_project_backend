import { PartialType } from '@nestjs/mapped-types';
import { CreateCriteriaGradeDto } from './create-criteria_grade.dto';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateCriteriaGradeDto extends PartialType(CreateCriteriaGradeDto) {

    @IsUUID()
    readonly criteria?: string;

    @IsUUID()
    readonly student?: string;

    @IsUUID()
    readonly studentEval?: string;
    
    @IsNotEmpty()
    @IsInt()
    grade?: number;
}
