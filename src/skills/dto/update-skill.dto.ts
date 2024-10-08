import { PartialType } from '@nestjs/mapped-types';
import { CreateSkillDto } from './create-skill.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsUUID } from 'class-validator';
export class UpdateSkillDto extends PartialType(CreateSkillDto) {

    @IsUUID()
    @IsOptional()
    readonly users?: string;

    @IsString({ message: 'El campo "name" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "name" no debe estar vacío.' })
    @IsOptional()
    readonly name?: string;

    @IsString({ message: 'El campo "description" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "description" no debe estar vacío.' })
    @IsOptional()
    readonly description?: string;

}
