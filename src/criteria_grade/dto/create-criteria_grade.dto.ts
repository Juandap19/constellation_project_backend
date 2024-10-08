import { IsInt, IsNotEmpty, IsString, IsUUID, Max, Min } from "class-validator";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class CreateCriteriaGradeDto {

    @IsUUID()
    readonly criteria: string;
  
    @IsUUID()
    readonly student: string;
  
    @IsUUID()
    readonly studentEval: string;
  
    @IsNotEmpty({ message: 'El campo "grade" no debe estar vacío.' })
    @IsInt({ message: 'El campo "grade" debe ser un número entero.' })
    @Min(0, { message: 'El campo "grade" debe ser al menos 0.' })
    @Max(5, { message: 'El campo "grade" no debe ser mayor que 5.' })
    grade: number;
}
