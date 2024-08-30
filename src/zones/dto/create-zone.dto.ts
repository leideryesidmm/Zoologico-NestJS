import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateZoneDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsNumber()
  jefeId: number;
}
