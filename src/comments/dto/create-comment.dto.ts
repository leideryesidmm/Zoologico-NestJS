import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsOptional()
  @IsNumber()
  initialCommentId?: number;

  @IsNotEmpty()
  @IsNumber()
  animalId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  menssage?: string;
}
