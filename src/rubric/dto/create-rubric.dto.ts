import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateRubricDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsUUID()
    @IsNotEmpty()
    activityId: string;
}
