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
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { StoreService } from './store.service';
import { UpdateStoreDto } from './dto';
import {  UserID } from '../../common';

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
  @Get()
  findAll() {
    return this.storeService.findAllData();
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
  @Get('profile')
  getProfile(@UserID() id: string) {
    return this.storeService.getProfile(id);
  }

  @ApiOperation({ summary: 'Fetch store StoreById' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'StoreById of store owner',
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
  @ApiBearerAuth()
  @Get('store-debtors')
  getStoreById(@UserID() id: string, @Query('fullname') searchQuary?: string) {
    return this.storeService.getStoreById(id, searchQuary);
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


  @ApiOperation({ summary: 'Upload store profile image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Upload store profile image',
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
  @UseInterceptors(FileInterceptor('file'))
  @Post('profile-image')
  uploadImage(@UserID() id: string, @UploadedFile() file: Express.Multer.File) {
    return this.storeService.uploadProfileImage(id, file);
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
