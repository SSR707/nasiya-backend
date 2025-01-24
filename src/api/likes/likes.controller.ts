import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guard/jwt-auth.guard';

// @UseGuards(JwtGuard)
@ApiTags('Like Api')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({
    summary: 'Create Likes ',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Like Created',
    schema: {
      example: {
        status_code: HttpStatus.CREATED,
        message: 'success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Failed creating Like',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'Store with id  b2d4aa27-0768-4456-947f-f8930c2 not found.',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Failed creating Like',
    schema: {
      example: {
        status_code: HttpStatus.NOT_FOUND,
        message: 'Debtor with id  b2d4aa27-0768-4456-947f-f8930c2 not found.',
        data: {},
      },
    },
  })
  @Post('createLike')
  @ApiBearerAuth()
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likesService.createLikes(createLikeDto);
  }

  @ApiOperation({
    summary: 'Get all Likes',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All Likes fetched successfully',
    schema: {
      example: {
        status_code: HttpStatus.OK,
        message: 'success',
        data: {
          id: 'sdf393820-0768-4456-947f-f8930c294394',
          store: [
            {
              id: 'b2d4aa27-0768-4456-947f-f8930c294394',
              created_at: '1730288822952',
              updated_at: '1730288797974',
              username: 'Ali',
              phone_number: '+998901234567',
              email: null,
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
  @Get('all')
  findAll() {
    return this.likesService.findAllLikes();
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
              id: 'b2d4aa27-0768-4456-947f-f8930c294394',
              created_at: '1730288822952',
              updated_at: '1730288797974',
              username: 'Ali',
              phone_number: '+998901234567',
              email: null,
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

  @ApiOperation({
    summary: 'Edit profile of Like',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the Like',
    type: String,
    example: 'b2d4aa27-0768-4456-947f-f8930c294394',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile of like edited',
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
    description: 'Failed edit profile of Like',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on update profile of Like',
      },
    },
  })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLikeDto: UpdateLikeDto,
  ) {
    return this.likesService.updateLikes(id, updateLikeDto);
  }

  @ApiOperation({
    summary: 'Delete Like by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of Like',
    type: String,
    example: 'b2d4aa27-0768-4456-947f-f8930c294394',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Like by ID deleted successfully',
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
    description: 'Failed delete LIke by ID',
    schema: {
      example: {
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Error on deleting Like by ID',
      },
    },
  })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.likesService.removeLIkes(id);
  }
}
