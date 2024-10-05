import { IsString, IsUUID } from 'class-validator';

export class CreateActivityDto {

  @IsUUID()
  readonly course: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;
}
