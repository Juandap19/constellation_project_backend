import { IsOptional, IsString } from "class-validator";
import { IsArray } from "class-validator";
import { IsUUID } from "class-validator";
import { Users } from "src/auth/entities/user.entity";

export class UpdateTeamsDto {
    @IsString()
    @IsOptional()
    readonly id: string;

    @IsString()
    @IsOptional()
    readonly name: string;

    @IsUUID()
    readonly users: string;

}