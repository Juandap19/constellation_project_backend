import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsEmail, Matches, IsArray, IsOptional, IsNotEmpty } from 'class-validator';
import { IsUUID } from 'class-validator';
import { Skills } from 'src/skills/entities/skill.entity';
import { Team } from 'src/teams/entities/teams.entity';
import { Course } from 'src/courses/entities/course.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString({ message: 'El campo "email" debe ser una cadena de texto.' })
    @IsOptional()
    @IsEmail({}, { message: 'El campo "email" debe ser una dirección de correo electrónico válida.' })
    readonly email?: string;

    @IsString({ message: 'El campo "password" debe ser una cadena de texto.' })
    @IsOptional()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'La contraseña es demasiado débil. Debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.',
    })
    password?: string;

    @IsString({ message: 'El campo "name" debe ser una cadena de texto.' })
    @IsOptional()
    readonly name?: string;

    @IsString({ message: 'El campo "last_name" debe ser una cadena de texto.' })
    @IsOptional()
    readonly last_name?: string;

    @IsString({ message: 'El campo "role" debe ser una cadena de texto.' })
    @IsOptional()
    readonly role?: string;

    @IsString({ message: 'El campo "user_code" debe ser una cadena de texto.' })
    @IsOptional()
    readonly user_code?: string;

    @IsArray()
    @IsUUID()
    skills?: Skills[];

    @IsArray()
    @IsUUID()
    teams?: Team[];

    @IsArray()
    @IsUUID()
    courses?: Course[];

     

}
