import { PartialType } from '@nestjs/mapped-types';
import { CreateRubricGradeDto } from './create-rubric_grade.dto';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateRubricGradeDto extends PartialType(CreateRubricGradeDto) {

    @IsUUID()
    readonly rubric: string;

    @IsUUID()
    readonly student: string;

    @IsUUID()
    readonly studentEval: string;
}
