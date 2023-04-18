import { Body, Controller, Get, Post, Query, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, RefreshTokenDto } from './dto/index';
import { JwtAuthGuard } from './guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/verify')
  async verify(@Res() res: Response, @Query('token') token: string) {
    const result = await this.authService.verify(token);
    res.redirect(301, result.redirectUrl);
  }

  @Post('/signup')
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Post('/signin')
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/refresh-token')
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }
}
