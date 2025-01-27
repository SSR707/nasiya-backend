import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SigninStoreDto } from './dto';
import { JwtGuard, CookieGetter, UserID } from '../../common';
import { PasscodeStoreDto } from '../store/dto';

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
    @Body() signinDto: SigninStoreDto,
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
  @UseGuards(JwtGuard)
  @Post('refresh-token')
  @ApiBearerAuth()
  refresh_token(@CookieGetter('refresh_token_store') refresh_token: string) {
    return this.authService.refresh_token(refresh_token);
  }
  @ApiOperation({ summary: 'Signin with passcode' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: 'Passcode is ',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    schema: {
      example: {
        status_code: HttpStatus.UNAUTHORIZED,
        message: 'not found',
        data: 'Invalid passcode',
      },
    },
  })
  @Post('signin-passcode')
  signinWithPasscode(
    @UserID('id') id: string,
    @Body() passcodeDto: PasscodeStoreDto,
  ) {
    return this.authService.loginWithPasscode(id, passcodeDto);
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
