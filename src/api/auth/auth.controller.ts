import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  UseGuards,
  Get,
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
import { CookieGetter, UserID } from '../../common';
import { PasscodeStoreDto, ResetPasscodeStoreDto } from '../store/dto';
import { StoreService } from '../store/store.service';
import { Public } from 'src/common/decorator/auth.decorator';

@ApiTags('Auth Api')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly storeService: StoreService,
  ) {}
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
  @Public()
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
        message: 'Failed to generate access token.',
      },
    },
  })
  @Post('refresh-token')
  @ApiBearerAuth()
  refresh_token(@CookieGetter('refresh_token_store') refresh_token: string) {
    return this.authService.refresh_token(refresh_token);
  }
  @ApiOperation({
    summary: 'Reset passcode store',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Store passcode resetted',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        messsage: 'Passcode updated',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Store not found',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'not found',
      },
    },
  })
  @ApiBearerAuth()
  @Get('reset-passcode')
  resetPass(
    @UserID('id') store_id: string,
    @Body() resetPasswordStoreDto: ResetPasscodeStoreDto,
  ) {
    return this.storeService.resetPasscode(resetPasswordStoreDto, store_id);
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
  @ApiOperation({ summary: 'Add passcode to store profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Store passcode added',
    schema: {
      example: {
        status_code: 200,
        message: 'OK',
        data: 'Passcode added successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Store not found',
    schema: {
      example: {
        status_code: 404,
        message: 'not found',
      },
    },
  })
  @ApiBearerAuth()
  @Post('create-passcode')
  createPasscode(
    @UserID('id') id: string,
    @Body() addPasscode: PasscodeStoreDto,
  ) {
    return this.storeService.addPasscode(id, addPasscode);
  }
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
  @ApiBearerAuth()
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
  @Post('logout')
  @ApiBearerAuth()
  logout(
    @CookieGetter('refresh_token_store') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(refresh_token, res);
  }
}
