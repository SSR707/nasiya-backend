import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { SampleMessageService } from './sample-message.service';
import { UpdateSampleMessageDto, CreateSampleMessageDto } from './dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('sample-message')
export class SampleMessageController {
  constructor(private readonly sampleMessageService: SampleMessageService) {}
  @ApiOperation({ summary: 'Create Sample Message' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sample Message created',
    schema: {
      example: {
        status_code: HttpStatus.CREATED,
        message: 'success',
        data: CreateSampleMessageDto,
      },
    },
  })
  @Post()
  create(@Body() createSampleMessageDto: CreateSampleMessageDto) {
    return this.sampleMessageService.create(createSampleMessageDto);
  }

  @ApiOperation({ summary: 'Get All Sample Message' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sample Message updated',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: [
          {
            id: '5a3efe3a-186c-4759-abcc-b67eab2b8098',
            store_id: '9a3efe3a-186c-4759-ab1235-1351324',
            sample: 'Sample message 1',
            created_at: '2021-05-19T10:46:42.186Z',
            updated_at: '2021-05-19T10:46:42.186Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sample Message not found',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'not found',
      },
    },
  })
  @Get()
  findAll() {
    return this.sampleMessageService.getAllSampleMsg();
  }

  @ApiOperation({ summary: 'Get One Sample Message' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get One Sample Message',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          id: '5a3efe3a-186c-4759-abcc-b67eab2b8098',
          store_id: '9a3efe3a-186c-4759-ab1235-1351324',
          sample: 'Sample message 1',
          created_at: '2021-05-19T10:46:42.186Z',
          updated_at: '2021-05-19T10:46:42.186Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sample Message not found',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'not found',
      },
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sampleMessageService.getOneSampleMsg(id);
  }

  @ApiOperation({ summary: 'Update One Sample Message' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '',
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
    description: '',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'not found',
      },
    },
  })
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

  @ApiOperation({ summary: 'Delete One Sample Message' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '',
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
    description: '',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'not found',
      },
    },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sampleMessageService.removeSampleMsg(id);
  }
}
