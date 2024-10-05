import { IsString, IsUUID } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

}
