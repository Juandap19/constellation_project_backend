import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
    
    @IsUUID()
    @IsOptional()
    id?: string;

    @IsString()
    @IsOptional()    
    name?: string;

    @IsUUID()
    @IsOptional()   
    readonly users?: string[];
}
