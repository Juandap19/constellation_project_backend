import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export  class  LoginUserDto {
    
    @IsString({ message: 'El campo "email" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "email" no debe estar vacío.' })
    @IsEmail({}, { message: 'El campo "email" debe ser una dirección de correo electrónico válida.' })
    email: string;
  
    @IsString({ message: 'El campo "password" debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo "password" no debe estar vacío.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
      message: 'La contraseña es demasiado débil. Debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.',
    })
    password: string;
}