import { PartialType } from '@nestjs/mapped-types';
import { CreateRubricDto } from './create-rubric.dto';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateRubricDto extends PartialType(CreateRubricDto) {
    
    @IsNotEmpty({ message: 'El campo "name" no debe estar vacío.' })
    @IsString({ message: 'El campo "name" debe ser una cadena de texto.' })
    @IsOptional()
    name: string;

    @IsUUID()
    @IsNotEmpty({ message: 'El campo "activityId" no debe estar vacío.' })
    @IsOptional()
    activityId: string;
}
