import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { JwtGuard, UserID } from 'src/common';

@ApiTags('Like Api')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({
    summary: ' Hand Like And Unlike  ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Hand Like And Unlike',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: 'LIKE or UNLIKE',
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the DEBTOR',
    type: String,
    example: 'b2d4aa27-0768-4456-947f-f8930c294394',
  })
  @Get('toggleLike/:id')
  handleLikeOrUnlike(
    @UserID() id: string,
    @Param('id', ParseUUIDPipe) debtorId: string,
  ) {
    return this.likesService.handleLikeOrUnlike(id, debtorId);
  }

  @ApiOperation({
    summary: 'Get Store all Likes',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Store All Likes fetched successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          id: 'sdf393820-0768-4456-947f-f8930c294394',
          store: [
            {
              id: '985c9b13-4a80-4b8f-b948-06efc8a78005',
              created_at: '1737879542488',
              updated_at: '1737879247573',
              fullname: 'Ali Hakimov',
              login: 'ALI001',
              wallet: '0.00',
              image: '.jpg',
              email: 'ali@gmail.com',
              phone_number: '+998991231212',
            },
          ],
          debtor: [
            {
              id: 'b2d4aa27-0768-4456-947f-f8930c294394',
              created_at: new Date(1730288822952),
              updated_at: new Date(1730288797974),
              full_name: 'John Doe',
              phone_number: '+998901234567',
              image: 'john_doe_image.jpg',
              address: 'Somewhere in Tashkent',
              note: 'Payment pending',
              is_deleted: false,
            },
          ],
          created_at: '1730288822952',
          updated_at: '1730288797974',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed fetching like',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on fetching likes',
      },
    },
  })
  @Get('StoreAllLike')
  findStoreAllLike(@UserID() id: string) {
    return this.likesService.findAllLikes(id);
  }

  @ApiOperation({
    summary: 'Get Like by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the Like',
    type: String,
    example: 'b2d4aa27-0768-4456-947f-f8930c294394',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Like fetched by id successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          id: 'sdf393820-0768-4456-947f-f8930c294394',
          store: [
            {
              id: '985c9b13-4a80-4b8f-b948-06efc8a78005',
              created_at: '1737879542488',
              updated_at: '1737879247573',
              fullname: 'Ali Hakimov',
              login: 'ALI001',
              wallet: '0.00',
              image: '.jpg',
              email: 'ali@gmail.com',
              phone_number: '+998991231212',
            },
          ],
          debtor: [
            {
              id: 'b2d4aa27-0768-4456-947f-f8930c294394',
              created_at: new Date(1730288822952),
              updated_at: new Date(1730288797974),
              full_name: 'John Doe',
              phone_number: '+998901234567',
              image: 'john_doe_image.jpg',
              address: 'Somewhere in Tashkent',
              note: 'Payment pending',
              is_deleted: false,
            },
          ],
          created_at: '1730288822952',
          updated_at: '1730288797974',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Failed creating Like',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'Like with id  b2d4aa27-0768-4456-947f-f8930c2 not found',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed fetching like by ID',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on fetching like by ID',
      },
    },
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.likesService.findOneLikes(id);
  }
}
