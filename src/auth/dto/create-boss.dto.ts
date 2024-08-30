import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
export class CreateBossDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsEmail()
  userEmail?: string;

  @IsNotEmpty()
  @IsString()
  pass?: string;
}
