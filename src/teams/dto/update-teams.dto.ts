import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsArray } from "class-validator";
import { IsUUID } from "class-validator";
import { Users } from "src/auth/entities/user.entity";

export class UpdateTeamsDto {

    @IsString()
    @IsOptional()
    readonly id: string;

    @IsString({ message: 'El campo "name" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "name" no debe estar vacío.' })
    @IsOptional()
    readonly name: string;

    @IsUUID()
    @IsOptional()
    readonly users: string;

}