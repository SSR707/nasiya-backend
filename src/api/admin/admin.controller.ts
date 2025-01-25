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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AdminService } from './admin.service';
import { CreateStoreDto } from '../store/dto';
import { CreateAdminDto, UpdateAdminDto, SigninAdminDto } from './dto';
import { SelfGuard, AdminGuard, JwtGuard, CookieGetter } from '../../common';
@ApiTags('Admin Api')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  //Create Admin
  @ApiOperation({
    summary: 'Create Admin ',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Admin created',
    schema: {
      example: {
        status_code: HttpStatus.CREATED,
        message: 'success',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed creating Admin',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on creating super Admin',
      },
    },
  })
  @Post('createAdmin')
  createSuperAdminAndAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  // Create Store
  @ApiOperation({
    summary: 'Create Store ',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Store created',
    schema: {
      example: {
        status_code: HttpStatus.CREATED,
        message: 'success',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed creating Store',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on creating Store',
      },
    },
  })
  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Post('createStore')
  @ApiBearerAuth()
  createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.adminService.createStore(createStoreDto);
  }

  @ApiOperation({
    summary: 'Signin Amin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin in successfully',
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
    description: 'Failed signing Admin',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Invalid username or password',
      },
    },
  })
  @Post('signin')
  signin(
    @Body() signinDto: SigninAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.signin(signinDto, res);
  }

  @ApiOperation({ summary: 'New access token for Admin' })
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
  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Post('refresh-token')
  @ApiBearerAuth()
  refresh_token(@CookieGetter('refresh_token_admin') refresh_token: string) {
    return this.adminService.refresh_token(refresh_token);
  }

  @ApiOperation({ summary: 'Logout Admmin' })
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
    description: 'Fail on logging out Admin',
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
    @CookieGetter('refresh_token_admin') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.logout(refresh_token, res);
  }

  //Get All admin
  @ApiOperation({
    summary: 'Get all admins',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All admins fetched successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
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
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on fetching admins',
      },
    },
  })
  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Get()
  @ApiBearerAuth()
  getAllAdmin() {
    return this.adminService.getAllAdmin();
  }

  //Get Admin ByID
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
        status_code: HttpStatus.OK,
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
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on fetching admin by ID',
      },
    },
  })
  @UseGuards(SelfGuard)
  @UseGuards(JwtGuard)
  @Get(':id')
  @ApiBearerAuth()
  getAdminById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getAdminById(id);
  }

  //Admin Edit Profile
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
        status_code: HttpStatus.OK,
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
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on update profile of admin',
      },
    },
  })
  @UseGuards(SelfGuard)
  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiBearerAuth()
  editProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.editProfile(id, updateAdminDto);
  }

  //Delete Admin ByID
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
        status_code: HttpStatus.OK,
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
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on deleting admin by ID',
      },
    },
  })
  @UseGuards(SelfGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiBearerAuth()
  deleteAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.delete(id);
  }
}
