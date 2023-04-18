import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLE_KEY } from '../constants';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    const currentRole: Role = user?.role;
    const requiredRole = this.reflector.get<Role>(ROLE_KEY, context.getHandler());

    // Consider EMPLOYEE > ASSOCIATE
    // So, any endpoint allowed for accessing via an ASSOCIATE will also be allowed for EMPLOYEE
    if (currentRole === 'EMPLOYEE') return true;
    return currentRole === requiredRole;
  }
}
