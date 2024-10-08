import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateSkillDto {


    @IsUUID()
    readonly users: string;

    @IsString({ message: 'El campo "name" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "name" no debe estar vacío.' })
    readonly name: string;

    @IsString({ message: 'El campo "description" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "description" no debe estar vacío.' })
    readonly description: string;

}
