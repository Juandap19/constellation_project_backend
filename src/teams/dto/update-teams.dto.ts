import { IsOptional, IsString } from "class-validator";

export class UpdateTeamsDto {
    @IsString()
    @IsOptional()
    readonly id?: string;

    @IsString()
    @IsOptional()
    readonly name?: string;
}