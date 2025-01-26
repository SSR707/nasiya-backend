import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StoreService } from './store.service';
import {
  AddPasscodeStoreDto,
  ResetPasscodeStoreDto,
  UpdateStoreDto,
} from './dto';
import { JwtGuard, UserID } from '../../common';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Store Api')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}
  @ApiOperation({
    summary: 'Get All Stores',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All Stores fetched successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: [
          {
            id: 'qwe41ifj1-2341gs-41asd-12fasgashqawerq',
            login: 'johndoes123',
            wallet: 300.99,
            image: './image.png',
            is_active: true,
            created_at: '1723900952341',
            updated_at: '1728794668799',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed fetchin stores',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on fetching stores',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.storeService.findAllData();
  }

  @ApiOperation({
    summary: 'Get store by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the store',
    type: String,
    example: '1412ahrqw-e351ad34-12g41934s-asr',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'One of store owner',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          login: 'johndoe12_1',
          image: './image.png',
          wallet: 134000.99,
          is_active: true,
          created_at: '1723900952341',
          updated_at: '1728794668799',
        },
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
  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
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
  @UseGuards(JwtGuard)
  @Get('reset-password')
  resetPass(
    @UserID() store_id: string,
    @Body() resetPasswordStoreDto: ResetPasscodeStoreDto,
  ) {
    return this.storeService.resetPasscode(resetPasswordStoreDto, store_id);
  }

  @ApiOperation({ summary: 'Fetch store profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile of store owner',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          image: './logo.png',
          fullname: 'John Doe',
          phone_number: '+998995564733',
          email: 'johndoe@example.com',
          created_at: '1723900952341',
          updated_at: '1728794668799',
        },
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
  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@UserID() id: string) {
    return this.storeService.getProfile(id);
  }

  @ApiOperation({ summary: 'Add passcode to store profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Store passcode added',
    schema: {
      example: {
        status_code: 200,
        message: 'OK',
        data: AddPasscodeStoreDto,
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
  @UseGuards(JwtGuard)
  @Post('create-passcode')
  createPasscode(
    @UserID() id: string,
    @Body() addPasscode: AddPasscodeStoreDto,
  ) {
    return this.storeService.addPasscode(id, addPasscode);
  }

  @ApiOperation({ summary: 'Update store profile' })
  @ApiParam({
    name: 'id',
    description: 'ID of the store',
    type: String,
    example: '1412ahrqw-e351ad34-12g41934s-asr',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated Profile of store owner',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          image: './logo.png',
          fullname: 'John Doe',
          phone_number: '+998995564733',
          email: 'johndoe@example.com',
          created_at: '1723900952341',
          updated_at: '1728794668799',
        },
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
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.updateProfile(id, updateStoreDto);
  }

  @ApiOperation({ summary: 'Delete Store' })
  @ApiParam({
    name: 'id',
    description: 'ID of the store',
    type: String,
    example: '1412ahrqw-e351ad34-12g41934s-asr',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete store by id',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {},
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
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(id);
  }
}
