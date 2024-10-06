import { IsString, IsUUID } from "class-validator";

export class CreateCourseDto {
    @IsUUID()
    id: string;
    
    @IsString()
    name: string;

    @IsUUID()
    readonly users: string;
}
