import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsEmail, Matches, IsArray, IsOptional } from 'class-validator';
import { IsUUID } from 'class-validator';
import { Skills } from 'src/skills/entities/skill.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString()
    @IsEmail()
    readonly email: string;
    
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {message: 'Password too weak'})
    password: string;

    @IsString()
    readonly name: string;

    @IsString()
    readonly last_name: string

    @IsString()
    readonly role: string;

    @IsString()
    readonly user_code: string;

    @IsArray()
    @IsUUID("all", { each: true, message: 'Each skill must be a valid UUID' })
    readonly skills: Skills[];

}
