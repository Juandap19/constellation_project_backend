import { IsNotEmpty, IsString } from "class-validator";
import { IsUUID } from "class-validator";

export class CreateTeamsDto {

    @IsString({ message: 'El campo "name" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "name" no debe estar vacío.' })
    readonly name: string;

    @IsUUID()
    readonly users: string;
}