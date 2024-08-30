import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsOptional()
  @IsNumber()
  initialComment?: number;

  @IsNotEmpty()
  @IsNumber()
  animal: number;

  @IsNotEmpty()
  @IsString()
  menssage?: string;
}
