import { IsNotEmpty, IsString, IsUUID, IsArray } from "class-validator";

export class CreateCourseDto {
    
    @IsUUID()
    @IsNotEmpty({ message: 'El campo "id" no debe estar vacío.' })
    id: string;
    
    @IsString()
    @IsNotEmpty({ message: 'El campo "name" no debe estar vacío.' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'El campo "description" no debe estar vacío.' })
    description: string;

    @IsArray()
    @IsUUID("all", { each: true, message: 'Cada elemento en "users" debe ser un UUID válido.' })
    @IsNotEmpty({ message: 'El campo "users" no debe estar vacío.' })
    readonly users: string[];
}