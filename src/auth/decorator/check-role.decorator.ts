import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ROLE_KEY } from '../constants';

export const CheckRole = (role: keyof typeof Role) => SetMetadata(ROLE_KEY, role);
