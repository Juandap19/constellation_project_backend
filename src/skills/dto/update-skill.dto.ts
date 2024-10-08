import { PartialType } from '@nestjs/mapped-types';
import { CreateSkillDto } from './create-skill.dto';
import { IsString } from 'class-validator';
import { IsUUID } from 'class-validator';
export class UpdateSkillDto extends PartialType(CreateSkillDto) {



    @IsUUID()
    readonly users?: string;

    @IsString()
    readonly name?: string

    @IsString()
    readonly description?: string

}
