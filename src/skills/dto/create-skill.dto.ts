import { IsString, IsUUID } from 'class-validator';

export class CreateSkillDto {


    @IsUUID()
    readonly users: string;

    @IsString()
    readonly name: string

    @IsString()
    readonly description: string

}
