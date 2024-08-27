import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSpeciesDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  zoneId: number;
}
