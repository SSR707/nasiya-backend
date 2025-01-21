import {
  BadRequestException,
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const CookieGetter = createParamDecorator(
  async (data: string, context: ExecutionContext): Promise<string> => {
    try {
      const request = context.switchToHttp().getRequest();
      const refresh_token = request.cookies[data];
      if (!refresh_token) {
        throw new UnauthorizedException('Forbidden user');
      }
      return refresh_token;
    } catch (error) {
      throw new BadRequestException(`Error on reading cookie: ${error}`);
    }
  },
);
