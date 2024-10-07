import { IsInt, IsNotEmpty, IsUUID } from "class-validator";

export class CreateRubricGradeDto {

    @IsUUID()
    rubric: string;

    @IsUUID()
    student: string;

    @IsUUID()
    studentEval: string;
}
