import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsNotEmpty, IsEmail, IsStrongPassword, IsString, IsOptional, IsEnum } from 'class-validator';
import { PasswordConfig } from '../constants';

export class SignUpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  @IsOptional()
  role: keyof typeof Role;

  @ApiProperty()
  @IsStrongPassword(PasswordConfig)
  @IsNotEmpty()
  password: string;
}
