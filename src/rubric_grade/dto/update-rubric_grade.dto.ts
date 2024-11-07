import { PartialType } from '@nestjs/mapped-types';
import { CreateRubricGradeDto } from './create-rubric_grade.dto';
import { IsInt, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdateRubricGradeDto extends PartialType(CreateRubricGradeDto) {

    @IsUUID()
    @IsOptional()
    readonly rubric: string;

    @IsUUID()
    @IsOptional()
    readonly studentEval: string;
}
