import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from 'src/board/entities/board.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { UpdateOrderListDto } from './dto/update-order-list.dto';
import { ListEntity } from './entities/list.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(ListEntity)
    private readonly listRepository: Repository<ListEntity>,
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
  ) {}

  async create(createListDto: CreateListDto, user: UserEntity): Promise<ListEntity> {
    try {
      const board = await this.boardRepository.findOne({ where: { id: createListDto.boardId } });

      if (!board) throw new NotFoundException('해당 보드를 찾을수없습니다.');

      const getLastOrder = await this.listRepository.findOne({
        where: { board: { id: createListDto.boardId } },
        order: {
          order: 'DESC',
        },
      });

      if (!getLastOrder) {
        const result = await this.listRepository.save({
          order: 1,
          userId: user.id,
          board: board,
          ...createListDto,
        });

        return result;
      }

      const list = this.listRepository.create({
        ...createListDto,
        order: getLastOrder.order + 1,
        board,
        userId: user.id,
      });

      return await this.listRepository.save(list);
    } catch (err) {
      throw err;
    }
  }

  async findAll(boardId: number): Promise<ListEntity[]> {
    try {
      const lists = await this.listRepository.find({
        where: { board: { id: boardId } },
        order: {
          order: 'ASC',
        },
      });

      if (lists.length === 0) throw new BadRequestException('리스트를 찾을 수 없습니다');

      return lists;
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: number): Promise<ListEntity> {
    try {
      const list = await this.listRepository.findOne({ where: { id }, relations: { cards: true } });

      if (!list) throw new NotFoundException('해당 리스트를 찾을 수 없습니다.');

      return list;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, updateListDto: UpdateListDto): Promise<ListEntity> {
    try {
      await this.listRepository.update({ id }, updateListDto);

      const updatedList = await this.listRepository.findOne({ where: { id } });

      return updatedList;
    } catch (err) {
      throw err;
    }
  }

  async updateOrder(boardId: number, updateOrderListDto: UpdateOrderListDto) {
    try {
      const list = await this.listRepository.findOne({
        where: { id: updateOrderListDto.listId },
      });

      const allOrderList = await this.listRepository.find({
        where: {
          board: { id: boardId },
        },
        select: {
          order: true,
        },
        order: {
          order: 'ASC',
        },
      });

      let getOrder: number = 0;

      if (updateOrderListDto.order === 1) {
        getOrder = allOrderList[0].order / 2;
      } else if (updateOrderListDto.order >= allOrderList.length) {
        getOrder = allOrderList[allOrderList.length - 1].order + 1;
      } else if (updateOrderListDto.order > list.order) {
        const targetOrder = allOrderList[updateOrderListDto.order].order;
        const preTargetOrder = allOrderList[updateOrderListDto.order - 1].order;

        getOrder = (targetOrder + preTargetOrder) / 2;
      } else {
        const targetOrder = allOrderList[updateOrderListDto.order - 1].order;
        const preTargetOrder = allOrderList[updateOrderListDto.order - 2].order;

        getOrder = (targetOrder + preTargetOrder) / 2;
      }

      await this.listRepository.update({ id: updateOrderListDto.listId }, { order: getOrder });

      return { ...list, order: getOrder };
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const result = await this.listRepository.delete({ id });

      if (result.affected === 0) {
        throw new NotFoundException(`List with ID ${id} not found`);
      }

      return { message: '리스트가 성공적으로 삭제되었습니다.' };
    } catch (err) {
      throw err;
    }
  }
}
