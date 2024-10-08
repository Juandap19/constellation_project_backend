import { PartialType } from '@nestjs/mapped-types';
import { CreateCriteriaDto } from './create-criteria.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class UpdateCriteriaDto extends PartialType(CreateCriteriaDto) {

    @IsUUID()
    @IsOptional()
    readonly rubric: string;
  
    @IsNotEmpty({ message: 'El campo "name" no debe estar vacío.' })
    @IsString({ message: 'El campo "name" debe ser una cadena de texto.' })
    @IsOptional()
    name: string;
  
    @IsNotEmpty({ message: 'El campo "description" no debe estar vacío.' })
    @IsString({ message: 'El campo "description" debe ser una cadena de texto.' })
    @IsOptional()
    description: string;
  
    @IsNotEmpty({ message: 'El campo "percentage" no debe estar vacío.' })
    @IsNumber({}, { message: 'El campo "percentage" debe ser un número.' })
    @Min(0, { message: 'El campo "percentage" debe ser al menos 0.' })
    @Max(100, { message: 'El campo "percentage" no debe ser mayor que 100.' })
    @IsOptional()
    percentage: number;

}
