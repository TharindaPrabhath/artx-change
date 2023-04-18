import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { DbService } from '../db/db.service';
import { AuthConfig, HASH_ROUNDS } from './constants';
import { RefreshTokenDto, SignInDto, SignUpDto } from './dto';
import { decodeToken } from './util';
import { EmailService } from 'src/email/email.service';
import { BACKEND_BASE_URL, FRONTEND_BASE_URL } from 'src/common/constants';
import { EmailTemplate } from 'src/email/constants';

@Injectable()
export class AuthService {
  constructor(
    private db: DbService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async signup(dto: SignUpDto) {
    const hashed = await bcrypt.hash(dto.password, HASH_ROUNDS);

    // Check whether the user with this email already exists or not
    const exists = await this.db.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException(`An user has been already registered with this email, ${dto.email}`);

    const user = await this.db.user.create({
      data: {
        email: dto.email,
        password: hashed,
        role: dto?.role,
        profile: { create: { firstName: dto.firstName, lastName: dto.lastName } },
      },
    });

    // Generate email verification token
    const verificationToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        expiresIn: AuthConfig.tokenExpiresIn.verificationToken,
        secret: this.configService.get<string>('TOKEN_SECRET'),
      },
    );

    const verificationUrl = `${BACKEND_BASE_URL}/auth/verify?token=${verificationToken}`;
    await this.emailService.send({
      to: dto.email,
      subject: 'Please verify your email for WeBold',
      templateId: EmailTemplate.GENERIC,
      dynamicTemplateData: {
        firstName: dto.firstName,
        title: 'Welcome to ArtxChange!',
        body: 'Click to verify your account. You’ll be redirected to ArtxChange,\nwhere you can start profile creation right away.',
        button: {
          text: 'Confirm Account',
          url: verificationUrl,
        },
      },
    });
  }
  async signin(dto: SignInDto) {
    const user = await this.db.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        isVerified: true,
        profile: { select: { firstName: true } },
      },
    });
    if (!user) throw new ForbiddenException('Incorrect credentials');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Incorrect credentials');

    if (!user.isVerified) {
      await this.sendVerificationEmail(user.id, user.email, user.profile.firstName);
      throw new ForbiddenException(
        'Account is not verified. We have sent a verification email. Please verify your account.',
      );
    }

    // Generate access and refresh tokens
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, role: user.role },
      {
        expiresIn: AuthConfig.tokenExpiresIn.verificationToken,
        secret: this.configService.get<string>('TOKEN_SECRET'),
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        expiresIn: AuthConfig.tokenExpiresIn.verificationToken,
        secret: this.configService.get<string>('TOKEN_SECRET'),
      },
    );

    delete user.password;
    return { accessToken, refreshToken, user };
  }

  async verify(token: string) {
    const payload = decodeToken(token);
    const userId = payload.sub;
    await this.db.user.update({
      where: { id: userId },
      data: { isVerified: true },
      include: { profile: true },
    });
    const redirectUrl = `${FRONTEND_BASE_URL}/auth/sign-in`;
    return { redirectUrl };
  }

  async refreshToken(dto: RefreshTokenDto) {
    // Decode the refresh token
    const payload = decodeToken(dto.refreshToken);
    const userId = payload?.sub;
    const user = await this.db.user.findUnique({ where: { id: userId } });
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, role: user.role },
      {
        expiresIn: AuthConfig.tokenExpiresIn.verificationToken,
        secret: this.configService.get<string>('TOKEN_SECRET'),
      },
    );
    return {
      accessToken,
      refreshToken: dto.refreshToken,
    };
  }

  async sendVerificationEmail(userId: string, email: string, firstName: string) {
    // Generate email verification token
    const verificationToken = await this.jwtService.signAsync(
      { sub: userId },
      {
        expiresIn: AuthConfig.tokenExpiresIn.verificationToken,
        secret: this.configService.get<string>('TOKEN_SECRET'),
      },
    );
    const verificationUrl = `${BACKEND_BASE_URL}/auth/verify?token=${verificationToken}`;
    await this.emailService.send({
      to: email,
      subject: 'Please verify your email for WeBold',
      templateId: EmailTemplate.GENERIC,
      dynamicTemplateData: {
        firstName: firstName,
        title: 'Welcome to Webold!',
        body: 'Click to verify your account. You’ll be redirected to Webold,\nwhere you can start profile creation right away.',
        button: {
          text: 'Confirm Account',
          url: verificationUrl,
        },
      },
    });
  }
}
