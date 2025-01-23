import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DebtorService } from './debtor.service';
import { CreateDebtorDto, UpdateDebtorDto } from './dto';
import { JwtGuard } from '../../common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader, ApiParam } from '@nestjs/swagger';
import { DebtorEntity } from '../../core/entity/debtor.entity';

@ApiTags('debtors')
@ApiBearerAuth()
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token for authentication',
})
@UseGuards(JwtGuard)
@Controller('debtors')
export class DebtorController {
  constructor(private readonly debtorService: DebtorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new debtor', description: 'Creates a new debtor record in the system' })
  @ApiResponse({ status: 201, description: 'The debtor has been successfully created.', type: DebtorEntity })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token is missing or invalid' })
  create(@Body() createDebtorDto: CreateDebtorDto) {
    return this.debtorService.create(createDebtorDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all active debtors', 
    description: 'Retrieves a list of all active debtors in the system'
  })
  @ApiResponse({ status: 200, description: 'List of active debtors retrieved successfully', type: [DebtorEntity] })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token is missing or invalid' })
  findAll() {
    return this.debtorService.findAllActive();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a debtor by id',
    description: 'Retrieves detailed information about a specific debtor'
  })
  @ApiParam({ name: 'id', description: 'The ID of the debtor', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Debtor found and returned successfully', type: DebtorEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token is missing or invalid' })
  @ApiResponse({ status: 404, description: 'Debtor with the specified ID was not found' })
  findOne(@Param('id') id: string) {
    return this.debtorService.findOne(id);
  }

  @Get(':id/total-debt')
  @ApiOperation({ 
    summary: 'Get total debt for a debtor',
    description: 'Calculates and returns the total debt amount for a specific debtor'
  })
  @ApiParam({ name: 'id', description: 'The ID of the debtor', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Total debt calculated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token is missing or invalid' })
  @ApiResponse({ status: 404, description: 'Debtor with the specified ID was not found' })
  getTotalDebt(@Param('id') id: string) {
    return this.debtorService.getTotalDebt(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update a debtor',
    description: 'Updates the information of an existing debtor'
  })
  @ApiParam({ name: 'id', description: 'The ID of the debtor to update', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Debtor updated successfully', type: DebtorEntity })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token is missing or invalid' })
  @ApiResponse({ status: 404, description: 'Debtor with the specified ID was not found' })
  update(@Param('id') id: string, @Body() updateDebtorDto: UpdateDebtorDto) {
    return this.debtorService.update(id, updateDebtorDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a debtor',
    description: 'Soft deletes a debtor from the system (marks as deleted)'
  })
  @ApiParam({ name: 'id', description: 'The ID of the debtor to delete', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Debtor deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token is missing or invalid' })
  @ApiResponse({ status: 404, description: 'Debtor with the specified ID was not found' })
  remove(@Param('id') id: string) {
    return this.debtorService.deleteSoft(id);
  }
}
