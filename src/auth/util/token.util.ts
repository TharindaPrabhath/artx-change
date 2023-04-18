import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

const configService = new ConfigService();
const secret = configService.get<string>('TOKEN_SECRET');

const jwt = new JwtService();

export const generateToken = async (payload: any, expiresIn: string): Promise<string> => {
  const token = await jwt.signAsync(payload, { expiresIn, secret });
  return token;
};

export const decodeToken = (token: string): string | { [key: string]: any } => {
  const payload = jwt.decode(token);
  return payload;
};
