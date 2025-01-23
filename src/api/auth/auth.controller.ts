import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SigninDto } from './dto/signin-store.dto';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';
import { JwtGuard } from 'src/common/guard/jwt-auth.guard';

@ApiTags('Auth Api')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({
    summary: 'Signin Sorte',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Store in successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpZCI6IjRkMGJ',
          access_token_expire: '24h',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpZCI6IjRkMGJ',
          refresh_token_expire: '15d',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed signing Store',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Invalid username or password',
      },
    },
  })
  @Post('signin')
  signin(
    @Body() signinDto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signin(signinDto, res);
  }

  @ApiOperation({ summary: 'New access token for Store' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get new access token success',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpZCI6IjRkMGJ',
          expire: '24h',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Fail new access token',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on refresh token',
      },
    },
  })
  @Post('refresh-token')
  refresh_token(@CookieGetter('refresh_token_store') refresh_token: string) {
    return this.authService.refresh_token(refresh_token);
  }

  @ApiOperation({ summary: 'Logout store' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Store logged out success',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Fail on logging out store',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on logout',
      },
    },
  })
  @UseGuards(JwtGuard)
  @Post('logout')
  @ApiBearerAuth()
  logout(
    @CookieGetter('refresh_token_store') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(refresh_token, res);
  }
}
