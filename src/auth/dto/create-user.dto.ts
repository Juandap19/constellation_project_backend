import { IsEmail, IsString, IsUUID, Matches, MinLength } from "class-validator";

export  class  CreateUserDto {

   

    @IsString()
    @IsEmail()
    readonly email: string;
    
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {message: 'Password too weak'})
    readonly password: string;

    @IsString()
    readonly name: string;

    @IsString()
    readonly last_name: string

    @IsString()
    readonly role: string;

    @IsString()
    readonly user_code: string;



}

