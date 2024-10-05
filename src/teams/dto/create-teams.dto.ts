import { IsString } from "class-validator";

export class CreateTeamsDto {
    @IsString()
    readonly name: string;
}