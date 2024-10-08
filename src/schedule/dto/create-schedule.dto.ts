
import { IsBoolean, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';


export class CreateScheduleDto {

    @IsUUID()
    readonly user: string;

    @IsString({ message: 'El campo "day" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "day" no debe estar vacío.' })
    readonly day: string;

    @IsString({ message: 'El campo "hour_i" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "hour_i" no debe estar vacío.' })
    readonly hour_i: string;
    
    @IsString({ message: 'El campo "hour_f" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "hour_f" no debe estar vacío.' })
    readonly hour_f: string;

    @IsBoolean({ message: 'El campo "state" debe ser un valor booleano.' })
    readonly state: boolean;

}