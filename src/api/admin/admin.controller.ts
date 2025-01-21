import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ParseUUIDPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { SigninDto } from './dto/signin-admin.dto';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { SelfGuard } from 'src/common/guard/self.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    summary: 'Create superAdmin and admin ',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Super admin created',
    schema: {
      example: {
        status_code: 201,
        message: 'success',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed creating super admin',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on creating super admin',
      },
    },
  })
  @Post('createAdmin')
  createSuperAdminAndAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createSuperAdmin(createAdminDto);
  }

  @ApiOperation({
    summary: 'Signin admin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin signed in successfully',
    schema: {
      example: {
        status_code: 200,
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
    description: 'Failed signing admin',
    schema: {
      example: {
        status_code: 400,
        message: 'Invalid username or password',
      },
    },
  })
  @Post('signin')
  signin(
    @Body() signinDto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.signin(signinDto, res);
  }

  @ApiOperation({ summary: 'New access token for admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get new access token success',
    schema: {
      example: {
        status_code: 200,
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
        status_code: 400,
        message: 'Error on refresh token',
      },
    },
  })
  @Post('refresh-token')
  refresh_token(@CookieGetter('refresh_token_admin') refresh_token: string) {
    return this.adminService.refresh_token(refresh_token);
  }

  @ApiOperation({ summary: 'Logout admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin logged out success',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Fail on logging out admin',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on logout',
      },
    },
  })
  // @UseGuards(JwtGuard)
  @Post('logout')
  @ApiBearerAuth()
  logout(
    @CookieGetter('refresh_token_admin') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.logout(refresh_token, res);
  }

  @ApiOperation({
    summary: 'Get all admins',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All admins fetched successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: [
          {
            id: 'b2d4aa27-0768-4456-947f-f8930c294394',
            created_at: '1730288822952',
            updated_at: '1730288797974',
            username: 'admin1',
            phone_number: '+998901234567',
            email: null,
            hashed_password: 'ajdkfq234hg324j0ijklj.234hi23',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed fetching admins',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on fetching admins',
      },
    },
  })
  // @UseGuards(SuperAdminGuard)
  // @UseGuards(JwtGuard)
  @Get()
  @ApiBearerAuth()
  getAllAdmin() {
    return this.adminService.getAllAdmin();
  }

  @ApiOperation({
    summary: 'Get admin by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the admin',
    type: String,
    example: 'b2d4aa27-0768-4456-947f-f8930c294394',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin fetched by id successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          id: 'b2d4aa27-0768-4456-947f-f8930c294394',
          created_at: '1730288822952',
          updated_at: '1730288797974',
          username: 'admin1',
          phone_number: '+998901234567',
          email: null,
          hashed_password: 'ajdkfq234hg324j0ijklj.234hi23',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed fetching admin by ID',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on fetching admin by ID',
      },
    },
  })
  // @UseGuards(SelfGuard)
  // @UseGuards(JwtGuard)
  @Get(':id')
  @ApiBearerAuth()
  getAdminById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getAdminById(id);
  }

  @ApiOperation({
    summary: 'Edit profile of admin',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the admin',
    type: String,
    example: 'b2d4aa27-0768-4456-947f-f8930c294394',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile of admin edited',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed edit profile of admin',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on update profile of admin',
      },
    },
  })
  // @UseGuards(SelfGuard)
  // @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiBearerAuth()
  editProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.editProfile(id, updateAdminDto);
  }

  @ApiOperation({
    summary: 'Delete admin by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of admin',
    type: String,
    example: 'b2d4aa27-0768-4456-947f-f8930c294394',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin by ID deleted successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed delete admin by ID',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on deleting admin by ID',
      },
    },
  })
  // @UseGuards(SuperAdminGuard)
  // @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiBearerAuth()
  deleteAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.delete(id);
  }
}
