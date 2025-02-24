// jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.jwt || this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        'You are not logged in! Please log in to get access.',
      );
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token);

      const user = await this.userService.findById(decoded.id);
      if (!user) {
        throw new UnauthorizedException(
          'The user belonging to this token no longer exists.',
        );
      }

      user.password = undefined;

      request.user = user;
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Token has expired. Please log in again.',
        );
      } else {
        throw new UnauthorizedException('Invalid token. Please log in again.');
      }
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
