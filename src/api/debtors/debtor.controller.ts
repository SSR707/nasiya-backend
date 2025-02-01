import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  Query,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DebtorService } from './debtor.service';
import { UserID } from '../../common';
import { DebtorEntity } from '../../core';
import { CreateDebtorDto, UpdateDebtorDto, CreateDebtorPhoneDto } from './dto';

@ApiTags('Debtor API')
@ApiBearerAuth()
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token for authentication',
})
@Controller('debtors')
export class DebtorController {
  constructor(private readonly debtorService: DebtorService) {}

  @Post()
  @ApiOperation({ summary: 'Create new debtors' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Debtors created successfully',
    schema: {
      example: {
        status_code: HttpStatus.CREATED,
        message: 'success',
        data: {
          id: 'qwe41ifj1-2341gs-41asd-12fasgashqawerq',
          fullname: 'John Doe',
          phone_number: '+998995564733',
          address: '123 Main St',
          is_active: true,
          created_at: '1723900952341',
          updated_at: '1728794668799',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to create debtors',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error creating debtors',
      },
    },
  })
  create(@UserID() id: string, @Body() createDebtorsDto: CreateDebtorDto) {
    return this.debtorService.create({ store_id: id, ...createDebtorsDto });
  }

  @Get()
  @ApiOperation({ summary: 'Get all debtors' })
  @ApiQuery({
    name: 'include',
    required: false,
    type: String,
    description: 'Comma-separated relations to include',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All debtors fetched successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: [
          {
            id: 'qwe41ifj1-2341gs-41asd-12fasgashqawerq',
            fullname: 'John Doe',
            phone_number: '+998995564733',
            address: '123 Main St',
            is_active: true,
            total_debt: 1000.00,
            created_at: '1723900952341',
            updated_at: '1728794668799',
          },
        ],
      },
    },
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('include') include?: string,
  ) {
    const options = {
      skip: page ? (page - 1) * (limit || 10) : 0,
      take: limit || 10,
    };
    const relations = include?.split(',').filter(Boolean) || [];
    return this.debtorService.getAllMessages(options, relations);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get debtors by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the debtors',
    type: String,
    example: '1412ahrqw-e351ad34-12g41934s-asr',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debtors fetched successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          id: 'qwe41ifj1-2341gs-41asd-12fasgashqawerq',
          fullname: 'John Doe',
          phone_number: '+998995564733',
          address: '123 Main St',
          is_active: true,
          total_debt: 1000.00,
          created_at: '1723900952341',
          updated_at: '1728794668799',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Debtors not found',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'not found',
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return this.debtorService.findOne(id, ['debts']);
  }

  @Get(':id/total-debt')
  @ApiOperation({ summary: 'Get total debt for debtors' })
  @ApiParam({
    name: 'id',
    description: 'ID of the debtors',
    type: String,
    example: '1412ahrqw-e351ad34-12g41934s-asr',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Total debt calculated successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          total_debt: 1000.00,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Debtors not found',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'not found',
      },
    },
  })
  getTotalDebt(@Param('id') id: string) {
    return this.debtorService.getTotalDebt(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update debtors profile' })
  @ApiParam({
    name: 'id',
    description: 'ID of the debtors',
    type: String,
    example: '1412ahrqw-e351ad34-12g41934s-asr',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debtors updated successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          id: 'qwe41ifj1-2341gs-41asd-12fasgashqawerq',
          fullname: 'John Doe',
          phone_number: '+998995564733',
          address: '123 Main St',
          is_active: true,
          updated_at: '1728794668799',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Debtors not found',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'not found',
      },
    },
  })
  update(@Param('id') id: string, @Body() updateDebtorsDto: UpdateDebtorDto) {
    return this.debtorService.updateProfile(id, updateDebtorsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete debtors' })
  @ApiParam({
    name: 'id',
    description: 'ID of the debtors',
    type: String,
    example: '1412ahrqw-e351ad34-12g41934s-asr',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debtors deleted successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Debtors not found',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'not found',
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.debtorService.deleteSoft(id);
  }

  @Post(':id/images')
  @ApiOperation({ summary: 'Upload debtors image' })
  @ApiParam({
    name: 'id',
    description: 'ID of the debtors',
    type: String,
    example: '1412ahrqw-e351ad34-12g41934s-asr',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image uploaded successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          id: 'qwe41ifj1-2341gs-41asd-12fasgashqawerq',
          url: './image.png',
          created_at: '1723900952341',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.debtorService.uploadDebtorImage(id, file);
  }

  @Post(':id/phones')
  @ApiOperation({ summary: 'Add debtors phone number' })
  @ApiParam({
    name: 'id',
    description: 'ID of the debtors',
    type: String,
    example: '1412ahrqw-e351ad34-12g41934s-asr',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Phone number added successfully',
    schema: {
      example: {
        status_code: HttpStatus.CREATED,
        message: 'success',
        data: {
          id: 'qwe41ifj1-2341gs-41asd-12fasgashqawerq',
          phone_number: '+998995564733',
          is_primary: true,
          created_at: '1723900952341',
        },
      },
    },
  })
  addPhone(
    @Param('id') id: string,
    @Body() createDebtorsPhoneDto: CreateDebtorPhoneDto,
  ) {
    return this.debtorService.service.addDebtorsPhone(createDebtorsPhoneDto);
  }

  @Get(':id/phones')
  @ApiOperation({ summary: 'Get debtors phone numbers' })
  @ApiParam({
    name: 'id',
    description: 'ID of the debtors',
    type: String,
    example: '1412ahrqw-e351ad34-12g41934s-asr',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Phone numbers fetched successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: [
          {
            id: 'qwe41ifj1-2341gs-41asd-12fasgashqawerq',
            phone_number: '+998995564733',
            is_primary: true,
            created_at: '1723900952341',
          },
        ],
      },
    },
  })
  getPhones(@Param('id') id: string) {
    return this.debtorService.getDebtorPhones(id);
  }
}