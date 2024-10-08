import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateActivityDto {

  @IsUUID()
  @IsOptional()
  readonly courseId?: string;

  @IsString({ message: 'El campo "id" debe ser una cadena de texto.' })
  @IsOptional()
  readonly id?: string;

  @IsString({ message: 'El campo "name" debe ser una cadena de texto.' })
  @IsOptional()
  readonly name?: string;

  @IsString({ message: 'El campo "description" debe ser una cadena de texto.' })
  @IsOptional()
  readonly description?: string;

}
