import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAnimalDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsNumber()
  speciesId: number;
}
