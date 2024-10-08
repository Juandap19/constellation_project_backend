import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateActivityDto {

  @IsUUID()
  readonly course: string;

  @IsString({ message: 'El campo "name" debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El campo "name" no debe estar vacío.' })
  readonly name: string;

  @IsString({ message: 'El campo "description" debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El campo "description" no debe estar vacío.' })
  readonly description: string;

}
