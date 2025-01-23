import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ResetPasswordStoreDto } from './dto/reset-password.dto';
import { UserID } from 'src/common/decorator/user-id.decorator';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  // @Post('signin')
  // sigin(@Body() createStoreDto: CreateStoreDto) {
  //   return this.storeService.create(createStoreDto);
  // }

  @Get()
  findAll() {
    return this.storeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }
  @Get('reset-password')
  resetPass(
    @UserID() store_id: string,
    @Body() resetPasswordStoreDto: ResetPasswordStoreDto,
  ) {
    return this.storeService.resetPassword(resetPasswordStoreDto, store_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(id);
  }
}
