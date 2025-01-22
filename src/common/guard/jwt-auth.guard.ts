import {
  Injectable,
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { CustomJwtService } from 'src/infrastructure/lib/custom-jwt/custom-jwt.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwt: CustomJwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;
    if (!auth) {
      throw new UnauthorizedException('Token not found');
    }
    const bearer = auth.split(' ')[0];
    const token = auth.split(' ')[1];
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Unauthorizated');
    }
    let user: any;
    try {
      user = await this.jwt.verifyAccessToken(token);
      req.user = user;
    } catch (error) {
      throw new UnauthorizedException('Token expired');
    }
    return true;
  }
}
