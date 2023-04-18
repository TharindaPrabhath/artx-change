import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { DbService } from '../db/db.service';
import { AuthConfig, HASH_ROUNDS } from './constants';
import { RefreshTokenDto, SignInDto, SignUpDto } from './dto';
import { decodeToken, generateToken } from './util';

@Injectable()
export class AuthService {
  constructor(private db: DbService, private jwtService: JwtService, private configService: ConfigService) {}
}
