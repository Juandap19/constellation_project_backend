import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { Users } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(private readonly reflector: Reflector){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles = this.reflector.get<string[]>(META_ROLES, context.getHandler());

    if(!validRoles || validRoles.length === 0){
      return true;
    }
    
    const request = context.switchToHttp().getRequest();

    const user = request.user as Users;

    if(!user){
      throw new BadRequestException('User not found');
    }

    if (validRoles.includes(user.role)) {
      return true;
    }

    throw new ForbiddenException('User does not have the required role');

  }
}