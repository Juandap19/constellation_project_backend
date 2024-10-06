
import { IsBoolean, IsString, IsUUID } from 'class-validator';


export class CreateScheduleDto {


      
       
    @IsUUID()
    readonly user: string;


    @IsString()
    readonly day: string;

    @IsString()
    readonly hour_i: string;
    
    @IsString()
    readonly hour_f: string;

    @IsBoolean()
    readonly state: boolean;




}