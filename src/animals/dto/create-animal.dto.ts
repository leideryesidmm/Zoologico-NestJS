import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateAnimalDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsNumber()
  speciesId: number;
}
