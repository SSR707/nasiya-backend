import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DebtorService } from './debtor.service';
import { CreateDebtorDto, UpdateDebtorDto } from './dto';
import { JwtGuard } from '../../common/guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('debtors')
@UseGuards(JwtGuard)
@Controller('debtors')
export class DebtorController {
  constructor(private readonly debtorService: DebtorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new debtor' })
  @ApiResponse({ status: 201, description: 'The debtor has been successfully created.' })
  create(@Body() createDebtorDto: CreateDebtorDto) {
    return this.debtorService.create(createDebtorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active debtors' })
  findAll() {
    return this.debtorService.findAllActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a debtor by id' })
  findOne(@Param('id') id: string) {
    return this.debtorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a debtor' })
  update(@Param('id') id: string, @Body() updateDebtorDto: UpdateDebtorDto) {
    return this.debtorService.update(id, updateDebtorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a debtor' })
  remove(@Param('id') id: string) {
    return this.debtorService.softDelete(id);
  }
}
