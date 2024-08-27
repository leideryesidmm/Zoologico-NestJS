import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsEmail()
  userEmail?: string;

  @IsNotEmpty()
  @IsString()
  pass?: string;

  @IsNotEmpty()
  jefeId?: number;
}
