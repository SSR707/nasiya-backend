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
  @ApiOperation({ summary: 'Create a new debtor' })
  @ApiResponse({
    status: 201,
    description: 'The debtor has been successfully created.',
  })
  @ApiOperation({
    summary: 'Create a new debtor',
    description: 'Creates a new debtor record in the system',
  })
  @ApiResponse({
    status: 201,
    description: 'The debtor has been successfully created.',
    type: DebtorEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token is missing or invalid',
  })
  create(@UserID() id: string, @Body() createDebtorDto: CreateDebtorDto) {
    return this.debtorService.create({ store_id: id, ...createDebtorDto });
  }

  @Get()
  @ApiOperation({ summary: 'Get all debtors' })
  @ApiQuery({
    name: 'include',
    required: false,
    type: String,
    description: 'Comma-separated relations to include (e.g., "images,phones")',
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

  @Get('active/all')
  @ApiOperation({ summary: 'Get all active debtors' })
  @ApiQuery({
    name: 'include',
    required: false,
    type: String,
    description: 'Comma-separated relations to include (e.g., "images,phones")',
  })
  async findAllActive(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('include') include?: string,
  ) {
    const options = {
      skip: page ? (page - 1) * (limit || 10) : 0,
      take: limit || 10,
      where: { is_active: true },
    };
    const relations = include?.split(',').filter(Boolean) || [];
    return this.debtorService.findAllActive(options, relations);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get debtor by id' })
  @ApiParam({ name: 'id', description: 'Debtor ID' })
  async findOne(@Param('id') id: string) {
    return this.debtorService.findOne(id , ['debts']);
  }

  @Get(':id/total-debt')
  @ApiOperation({
    summary: 'Get total debt for a debtor',
    description:
      'Calculates and returns the total debt amount for a specific debtor',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the debtor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Total debt calculated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token is missing or invalid',
  })
  @ApiResponse({
    status: 404,
    description: 'Debtor with the specified ID was not found',
  })
  getTotalDebt(@Param('id') id: string) {
    return this.debtorService.getTotalDebt(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a debtor',
    description: 'Updates the information of an existing debtor',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the debtor to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Debtor updated successfully',
    type: DebtorEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token is missing or invalid',
  })
  @ApiResponse({
    status: 404,
    description: 'Debtor with the specified ID was not found',
  })
  update(@Param('id') id: string, @Body() updateDebtorDto: UpdateDebtorDto) {
    return this.debtorService.updateProfile(id, updateDebtorDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a debtor',
    description: 'Soft deletes a debtor from the system (marks as deleted)',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the debtor to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Debtor deleted successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token is missing or invalid',
  })
  @ApiResponse({
    status: 404,
    description: 'Debtor with the specified ID was not found',
  })
  remove(@Param('id') id: string) {
    return this.debtorService.deleteSoft(id);
  }

  @Post(':id/images')
  @ApiOperation({
    summary: 'Upload debtor image',
    description: 'Upload an image file for a specific debtor',
  })
  @ApiParam({ name: 'id', description: 'Debtor ID' })
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

  @Delete('images/:id')
  @ApiOperation({
    summary: 'Remove debtor image',
    description: 'Remove an image from a debtor',
  })
  @ApiParam({ name: 'id', description: 'Image ID' })
  removeImage(@Param('id') id: string) {
    return this.debtorService.removeDebtorImage(id);
  }

  @Get(':id/images')
  @ApiOperation({
    summary: 'Get debtor images',
    description: 'Get all images for a specific debtor',
  })
  @ApiParam({ name: 'id', description: 'Debtor ID' })
  getImages(@Param('id') id: string) {
    return this.debtorService.getDebtorImages(id);
  }

  @Post(':id/phones')
  @ApiOperation({
    summary: 'Add debtor phone number',
    description: 'Add a new phone number for a specific debtor',
  })
  @ApiParam({ name: 'id', description: 'Debtor ID' })
  addPhone(
    @Param('id') id: string,
    @Body() createDebtorPhoneDto: CreateDebtorPhoneDto,
  ) {
    return this.debtorService.addDebtorPhone(createDebtorPhoneDto);
  }

  @Delete('phones/:id')
  @ApiOperation({
    summary: 'Remove debtor phone number',
    description: 'Remove a phone number from a debtor',
  })
  @ApiParam({ name: 'id', description: 'Phone number ID' })
  removePhone(@Param('id') id: string) {
    return this.debtorService.removeDebtorPhone(id);
  }

  @Get(':id/phones')
  @ApiOperation({
    summary: 'Get debtor phone numbers',
    description: 'Get all phone numbers for a specific debtor',
  })
  @ApiParam({ name: 'id', description: 'Debtor ID' })
  getPhones(@Param('id') id: string) {
    return this.debtorService.getDebtorPhones(id);
  }
}
