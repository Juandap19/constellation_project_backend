import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {

    @IsUUID()
    @IsOptional()
    readonly user: string;

    @IsString({ message: 'El campo "day" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "day" no debe estar vacío.' })
    @IsOptional()
    readonly day: string;

    @IsString({ message: 'El campo "hour_i" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "hour_i" no debe estar vacío.' })
    @IsOptional()
    readonly hour_i: string;
    
    @IsString({ message: 'El campo "hour_f" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "hour_f" no debe estar vacío.' })
    @IsOptional()
    readonly hour_f: string;

    @IsBoolean({ message: 'El campo "state" debe ser un valor booleano.' })
    @IsOptional()
    readonly state: boolean;

}
