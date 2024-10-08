import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateRubricDto {

    @IsNotEmpty({ message: 'El campo "name" no debe estar vacío.' })
    @IsString({ message: 'El campo "name" debe ser una cadena de texto.' })
    name: string;

    @IsUUID()
    @IsNotEmpty({ message: 'El campo "activityId" no debe estar vacío.' })
    activityId: string;
}
