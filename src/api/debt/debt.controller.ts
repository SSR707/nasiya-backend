import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DebtService } from './debt.service';
import { UpdateDebtDto, CreateDebtDto } from './dto';

@ApiBearerAuth()
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token for authentication',
})
@ApiTags('Debt API')
@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @ApiOperation({
    summary: 'Create debt',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Debt created',
    schema: {
      example: {
        status_code: HttpStatus.CREATED,
        message: 'success',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed creating debt',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on creating debt',
      },
    },
  })
  @Post()
  create(@Body() createDebtDto: CreateDebtDto) {
    return this.debtService.createDebt(createDebtDto);
  }

  @ApiOperation({
    summary: 'Get all debts',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All debts fetched successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: [
          {
            id: 'b2d4aa27-0768-4456-947f-f8930c294394',
            created_at: '1730288822952',
            updated_at: '1730288797974',
            debtor_id: 'b2d4aa27-0768-4456-947f-f8930c294394',
            debt_date: '1730288822952',
            debt_period: '6',
            debt_sum: '1000.00',
            description: 'description',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed fetching debts',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on fetching debts',
      },
    },
  })
  @Get()
  findAll() {
    return this.debtService.findAllDebts();
  }

  @ApiOperation({ summary: 'Get all debts with pagination' })
  @ApiQuery({
    name: 'include',
    required: false,
    type: String,
    description: 'Comma-separated relations to include (e.g., "images,phones")',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debt not found',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: `Debts fetched.`,
        data: [
          {
            id: '1c2c57c8-cd1e-4fd0-ba22-7eb4545ee942',
            debtor_id: '7aeadab4-1b9c-4d6a-ae8d-e95ea1929282',
            debt_date: '2025-01-12',
            debt_period: 12,
            debt_sum: 12000000,
            month_sum: 1000000,
            description: 'Test debt',
            created_at: 1738010850469,
            updated_at: 1738010843136,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Debt not found',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'not found',
      },
    },
  })
  @Get('find-pagination')
  findAllWithPaginations(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.debtService.getAllMessages(page, limit);
  }

  @ApiOperation({
    summary: 'Calculate the next payment for a debt',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the debt',
    type: String,
    example: 'b2d4aa27-0768-4456-947f-f8930c294394',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Next payment details retrieved successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'Success',
        data: {
          nextMonth: 50.0,
          nextMonths: 100.0,
          debt_period: 12,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Debt Not Found',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'Debt Not Found',
      },
    },
  })
  @Get('next-payment/:id')
  calculateNextPayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.debtService.calculateNextPayment(id);
  }

  @ApiOperation({
    summary: 'Get debt by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the debt',
    type: String,
    example: 'b2d4aa27-0768-4456-947f-f8930c294394',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debt fetched by id successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          id: 'b2d4aa27-0768-4456-947f-f8930c294394',
          created_at: '1730288822952',
          updated_at: '1730288797974',
          debtor_id: 'b2d4aa27-0768-4456-947f-f8930c294394',
          debt_date: '1730288822952',
          debt_period: '12',
          debt_sum: '1000.00',
          description: 'description',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed fetching debt by ID',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on fetching debt by ID',
      },
    },
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.debtService.findOneDebtById(id);
  }

  @ApiOperation({
    summary: 'Edit debt',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the debt',
    type: String,
    example: 'b2d4aa27-0768-4456-947f-f8930c294394',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debt edited',
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
    description: 'Failed edit debt',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on update debt',
      },
    },
  })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDebtDto: UpdateDebtDto,
  ) {
    return this.debtService.updateDebtById(id, updateDebtDto);
  }

  @ApiOperation({
    summary: 'Delete debt by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of debt',
    type: String,
    example: 'b2d4aa27-0768-4456-947f-f8930c294394',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debt by ID deleted successfully',
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
    description: 'Failed delete debt by ID',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on deleting debt by ID',
      },
    },
  })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.debtService.deleteDebtById(id);
  }

  // Image of Debts
  @ApiOperation({
    summary: 'Upload debt image',
    description: 'Upload an image file for a specific debt',
  })
  @ApiParam({ name: 'id', description: 'Debt ID' })
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
    status: HttpStatus.CREATED,
    description: 'image added successfully',
    schema: {
      example: {
        status_code: HttpStatus.CREATED,
        message: 'Debt image successfully created.',
        data: {
          image: 'uploads/debts/fe9a467d-44fe-4bb1-9864-ff31f4ed4847.png',
          debt_id: '47105a8b-439b-4d0d-b7d4-a345706e1229',
          id: '566d3199-0186-40da-948a-92d370d01658',
          created_at: '1738425625763',
          updated_at: '1738425610753',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Uuid Id cannot be parsed',
    schema: {
      example: {
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('image/:id')
  createDebtImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.debtService.createDebtImage(id, file);
  }

  @ApiOperation({
    summary: 'Upload debt image',
    description: 'Upload an image file for a specific debt',
  })
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
    status: HttpStatus.CREATED,
    description: 'image added successfully',
    schema: {
      example: {
        status_code: HttpStatus.CREATED,
        message: 'Debt image successfully created.',
        data: {
          image_url: '.png or jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Uuid Id cannot be parsed',
    schema: {
      example: {
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-imag')
  uploadDebtImage(@UploadedFile() file: Express.Multer.File) {
    return this.debtService.uploadDebtImage(file);
  }

  @ApiOperation({
    summary: 'Upload debt image',
    description: 'Upload an image file for a specific debt',
  })
  @ApiParam({ name: 'id', description: 'Debt ID' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'image added successfully',
    schema: {
      example: {
        status_code: HttpStatus.CREATED,
        message: 'Debt image successfully created.',
        data: {
          url:'svg , jpg'
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Uuid Id cannot be parsed',
    schema: {
      example: {
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      },
    },
  })
  @Post('image-upload/:id')
  createDebtImg(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('url') url: string,
  ) {
    return this.debtService.createImgDebt(id, url);
  }

  @ApiOperation({
    summary: 'Get debt images',
    description: 'Get all images for a specific debt',
  })
  @ApiParam({ name: 'id', description: 'Debt ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image fetched',
    schema: {
      example: {
        status_code: 200,
        message: 'Debt images retrieved successfully.',
        data: [
          {
            id: '566d3199-0186-40da-948a-92d370d01658',
            created_at: '1738425625763',
            updated_at: '1738425610753',
            image: 'uploads/debts/fe9a467d-44fe-4bb1-9864-ff31f4ed4847.png',
            debt_id: '47105a8b-439b-4d0d-b7d4-a345706e1229',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Image not found on debt',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'not found',
      },
    },
  })
  @Get('images/:id')
  findImagesById(@Param('id', ParseUUIDPipe) id: string) {
    return this.debtService.findDebtImages(id);
  }

  @ApiOperation({
    summary: 'Remove debtor image',
    description: 'Remove an image from a debtor',
  })
  @ApiParam({ name: 'id', description: 'Image ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deleted Successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'Image deleted successfully.',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Not Found',
    schema: {
      example: {
        message: 'Error deleting image: Image not found!',
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      },
    },
  })
  @Delete('image/:id')
  deleteImageById(@Param('id', ParseUUIDPipe) id: string) {
    return this.debtService.deleteDebtImage(id);
  }
}
