import { IsEmail, IsNotEmpty, IsString, IsUUID, Matches, MinLength } from "class-validator";

export  class  CreateUserDto {

    @IsString({ message: 'El campo "email" debe ser una cadena de texto.' })
    @IsEmail({}, { message: 'El campo "email" debe ser una dirección de correo electrónico válida.' })
    email: string;
  
    @IsString({ message: 'El campo "password" debe ser una cadena de texto.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, { message: 'La contraseña es demasiado débil. Debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.' })
    password: string;
  
    @IsString({ message: 'El campo "name" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "name" no debe estar vacío.' })
    name: string;
  
    @IsString({ message: 'El campo "last_name" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "last_name" no debe estar vacío.' })
    last_name: string;
  
    @IsString({ message: 'El campo "user_code" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "user_code" no debe estar vacío.' })
    user_code: string;
  
    @IsString({ message: 'El campo "role" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "role" no debe estar vacío.' })
    role: string;

}

