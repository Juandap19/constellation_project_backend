import { IsString } from "class-validator";
import { IsUUID } from "class-validator";

export class CreateTeamsDto {
    @IsString()
    readonly name: string;

    @IsUUID()
    readonly users: string;
}