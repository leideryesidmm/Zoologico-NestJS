import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateZoneDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsNumber()
  jefeId: number;
}
