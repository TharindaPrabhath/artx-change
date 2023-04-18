import { IsNotEmpty, IsEmail, IsStrongPassword, IsString, IsOptional, IsEnum } from 'class-validator';
import { PasswordConfig } from '../constants';
import { Role } from '@prisma/client';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(Role)
  @IsOptional()
  role: keyof typeof Role;

  // @IsStrongPassword(PasswordConfig)
  @IsString()
  @IsNotEmpty()
  password: string;
}
