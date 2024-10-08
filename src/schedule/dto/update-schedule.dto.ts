import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';
import { IsBoolean, IsString, IsUUID } from 'class-validator';
export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {


    
    @IsUUID()
    readonly user?: string;


    @IsString()
    readonly day?: string;

    @IsString()
    readonly hour_i?: string;
    
    @IsString()
    readonly hour_f?: string;

    @IsBoolean()
    readonly state?: boolean;





}
