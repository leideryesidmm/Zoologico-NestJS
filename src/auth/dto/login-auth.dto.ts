import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty()
  @IsEmail()
  userEmail?: string;

  @IsNotEmpty()
  @IsString()
  pass?: string;
}
