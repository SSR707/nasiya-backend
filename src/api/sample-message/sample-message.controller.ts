import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SampleMessageService } from './sample-message.service';
import { UpdateSampleMessageDto, CreateSampleMessageDto } from './dto';

@Controller('sample-message')
export class SampleMessageController {
  constructor(private readonly sampleMessageService: SampleMessageService) {}

  @Post()
  create(@Body() createSampleMessageDto: CreateSampleMessageDto) {
    return this.sampleMessageService.create(createSampleMessageDto);
  }

  @Get()
  findAll() {
    return this.sampleMessageService.getAllSampleMsg();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sampleMessageService.getOneSampleMsg(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSampleMessageDto: UpdateSampleMessageDto,
  ) {
    return this.sampleMessageService.updateSampleMsg(
      id,
      updateSampleMessageDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sampleMessageService.removeSampleMsg(id);
  }
}
