import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { itemsEntity } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemModule } from './item.module';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(itemsEntity)
    private readonly itemRepository: Repository<itemsEntity>,
    // @InjectRepository(Checklist)
    // private checklistRepository: Repository<Checklist>
  ) {}

  async create(createItemDto: CreateItemDto) {
    const { checklistId, content } = createItemDto;

    const item = this.itemRepository.create({
      content,
      status: false,
      //  checklist
    });
    return this.itemRepository.save(item);
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    await this.itemRepository.update(id, updateItemDto);

    const updatedItem = await this.itemRepository.findOne({ where: { id } });

    return {
      updatedItem,
      message: '아이템이 성공적으로 업데이트되었습니다.',
    };
  }

  async remove(itemId: number) {
    await this.itemRepository.delete({
      id: itemId,
    });

    return { message: '체크 리스트 항목이 성공적으로 삭제 되었습니다.' };
  }
}
