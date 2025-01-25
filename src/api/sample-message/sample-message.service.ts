import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { UpdateSampleMessageDto, CreateSampleMessageDto } from './dto';
import { BaseService } from '../../infrastructure';
import { SampleMessageEntity, SampleMessageRepository } from '../../core';

@Injectable()
export class SampleMessageService extends BaseService<
  CreateSampleMessageDto,
  DeepPartial<SampleMessageEntity>
> {
  constructor(
    @InjectRepository(SampleMessageEntity) repository: SampleMessageRepository,
  ) {
    super(repository);
  }
  async createSampleMsg(createSampleMessageDto: CreateSampleMessageDto) {
    return await this.create(createSampleMessageDto);
  }

  async getAllSampleMsg() {
    const data = await this.getRepository.find();
    if (data.length === 0) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
    return {
      status_code: HttpStatus.OK,
      message: 'Sample Messages retrieved successfully',
      data,
    };
  }

  async getOneSampleMsg(id: string) {
    return await this.findOneBy({ where: { id } });
  }

  async updateSampleMsg(
    id: string,
    updateSampleMessageDto: UpdateSampleMessageDto,
  ) {
    const getMsg = await this.getRepository.findOneBy({
      where: { id },
    });
    if (!getMsg) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
    const updateMsg = await this.getRepository.update(
      id,
      updateSampleMessageDto,
    );
    return {
      status_code: {
        code: HttpStatus.NOT_FOUND,
        message: 'Message not found',
        data: updateMsg.raw,
      },
    };
  }

  async removeSampleMsg(id: string) {
    return await this.delete(id);
  }
}
