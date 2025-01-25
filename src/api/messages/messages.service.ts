import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { UpdateMessageDto, CreateMessageDto } from './dto';
import { BaseService } from '../../infrastructure';
import { MessageEntity, MessageRepository } from '../../core';

@Injectable()
export class MessagesService extends BaseService<
  CreateMessageDto,
  DeepPartial<MessageEntity>
> {
  constructor(@InjectRepository(MessageEntity) repository: MessageRepository) {
    super(repository);
  }
  async createMessage(createMessageDto: CreateMessageDto) {
    return await this.create(createMessageDto);
  }

  async getAllMessages() {
    const data = await this.getRepository.find({
      relations: ['sampleMessage'],
    });
    if (data.length === 0) {
      throw new HttpException('not found', 404);
    }
    return {
      status_code: 200,
      message: 'Messages retrieved successfully',
      data,
    };
  }

  async getOneMessage(id: string) {
    return await this.findOneBy({
      where: { id },
      relations: ['sampleMessage'],
    });
  }

  async updateMessage(id: string, updateMessageDto: UpdateMessageDto) {
    const message = await this.getRepository.findOneBy({ where: { id } });
    if (!message) {
      throw new HttpException(`Message with id ${id} not found.`, 404);
    }
    const updatedData = await this.getRepository.update(id, updateMessageDto);
    return {
      status_code: 200,
      message: 'Message updated successfully',
      data: updatedData.raw,
    };
  }

  async deleteMessages(id: string) {
    return await this.delete(id);
  }
}
