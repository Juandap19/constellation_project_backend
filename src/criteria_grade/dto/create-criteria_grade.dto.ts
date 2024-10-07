import { IsInt, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class CreateCriteriaGradeDto {

    @IsUUID()
    readonly criteria: string;

    @IsUUID()
    readonly student: string;

    @IsUUID()
    readonly studentEval: string;

    @IsNotEmpty()
    @IsInt()
    grade: number;
}
