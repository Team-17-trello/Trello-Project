import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChecklistEntity } from 'src/checklist/entities/checklist.entity';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemEntity } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    @InjectRepository(ChecklistEntity)
    private checklistRepository: Repository<ChecklistEntity>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    try {
      const { checklistId, content } = createItemDto;

      const checkList = await this.checklistRepository.findOne({
        where: { id: checklistId },
      });

      const item = this.itemRepository.create({
        content,
        status: false,
        checklist: checkList,
      });

      return this.itemRepository.save(item);
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    try {
      await this.itemRepository.update(id, updateItemDto);

      const updatedItem = await this.itemRepository.findOne({ where: { id } });

      return {
        updatedItem,
        message: '아이템이 성공적으로 업데이트되었습니다.',
      };
    } catch (err) {
      throw err;
    }
  }

  async remove(itemId: number) {
    try {
      await this.itemRepository.delete({
        id: itemId,
      });

      return { message: '체크 리스트 항목이 성공적으로 삭제 되었습니다.' };
    } catch (err) {
      throw err;
    }
  }
}
