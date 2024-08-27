import {
  IsString,
  IsEmail,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Role } from '../entities/Role.enum';

export class CreateUserDto {
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
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsBoolean()
  disable?: boolean;

  @IsOptional()
  jefeId?: number;
}
