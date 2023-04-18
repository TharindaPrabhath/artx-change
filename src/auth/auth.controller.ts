import { Body, Controller, Get, Post, Query, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { SignInDto, SignUpDto, RefreshTokenDto } from './dto/index';
import { JwtAuthGuard } from './guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
}
