import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UpdateMessageDto, CreateMessageDto } from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {  MessageStatus, UserID } from 'src/common';
@ApiBearerAuth()
@ApiTags('Message API')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: 'Create Message' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create Message',
    schema: {
      example: {
        status_code: HttpStatus.CREATED,
        message: 'success',
        data: CreateMessageDto,
      },
    },
  })
  @Post()
  create(@UserID() id: string, @Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.createMessage(id, createMessageDto);
  }

  @ApiOperation({ summary: 'Get All Messages' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get All Messages',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: [
          {
            id: '67a6c34c-6959-4e3e-a298-64b505e7f5e4',
            store_id: '2de70fe6-af5f-451d-b446-3f6a9c0be243',
            deptor_id: '4c8a0141-cc48-4ec8-a777-132d5e50341e',
            message: 'Hello World',
            status: MessageStatus.SENT,
            sample_message_id: '1a2b3c4d-5e6f-7g8h-9i0j-klmno',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found Messages',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'not found',
      },
    },
  })
  @Get()
  findAll() {
    return this.messagesService.getAllMessages();
  }

  @ApiOperation({ summary: 'Get One Message' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get One Message',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          id: '67a6c34c-6959-4e3e-a298-64b505e7f5e4',
          store_id: '2de70fe6-af5f-451d-b446-3f6a9c0be243',
          deptor_id: '4c8a0141-cc48-4ec8-a777-132d5e50341e',
          message: 'Hello World',
          status: MessageStatus.SENT,
          sample_message_id: '1a2b3c4d-5e6f-7g8h-9i0j-klmno',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found Messages',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'not found',
      },
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.getOneMessage(id);
  }

  @ApiOperation({ summary: 'Update One Message' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update Message',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          ...UpdateMessageDto,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found Messages',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'not found',
      },
    },
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.updateMessage(id, updateMessageDto);
  }

  @ApiOperation({ summary: 'Delete One Message' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete Message',
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
    description: 'Not found Messages',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'not found',
      },
    },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.deleteMessages(id);
  }
}
