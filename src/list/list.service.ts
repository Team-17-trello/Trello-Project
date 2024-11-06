import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from 'src/board/entities/board.entity';
import { Repository } from 'typeorm';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListEntity } from './entities/list.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(ListEntity)
    private readonly listRepository: Repository<ListEntity>,
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
  ) {}

  async create(createListDto: CreateListDto): Promise<ListEntity> {
    const board = await this.boardRepository.findOne({ where: { id: createListDto.boardId } });

    if (!board) throw new NotFoundException('해당 보드를 찾을수없습니다.');
    const listCount = await this.listRepository.count({
      where: { board: { id: createListDto.boardId } },
    });

    const list = this.listRepository.create({
      ...createListDto,
      order: listCount + 1,
      board,
    });

    return await this.listRepository.save(list);
  }

  async findAll(boardId: number): Promise<ListEntity[]> {
    const lists = await this.listRepository.find({
      where: { board: { id: boardId } },
      order: {
        order: 'DESC',
      },
    });

    if (lists.length === 0) throw new BadRequestException('리스트를 찾을 수 없습니다');

    return lists;
  }

  async findOne(id: number): Promise<ListEntity> {
    const list = await this.listRepository.findOne({ where: { id } });

    if (!list) throw new NotFoundException('해당 리스트를 찾을 수 없습니다.');

    return list;
  }

  async update(id: number, updateListDto: UpdateListDto): Promise<ListEntity> {
    await this.listRepository.update({ id }, updateListDto);

    const updatedList = await this.listRepository.findOne({ where: { id } });

    return updatedList;
  }

  async updateOrder(id: number, updateListDto: UpdateListDto) {
    const allOrderList = await this.listRepository.find({
      select: {
        order: true,
      },
      order: {
        order: 'ASC',
      },
    });

    let getOrder = 0;

    if (updateListDto.order === 1) {
      getOrder = allOrderList[0].order / 2;
    } else if (updateListDto.order === allOrderList.length + 1) {
      getOrder = allOrderList[allOrderList.length - 1].order + 1;
    } else {
      const targetOrder = allOrderList[updateListDto.order - 1].order;
      const preTargetOrder = allOrderList[updateListDto.order - 2].order;

      getOrder = (targetOrder + preTargetOrder) / 2;
    }

    await this.listRepository.update({ id: id }, { order: getOrder });
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.listRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }

    return { message: '리스트가 성공적으로 삭제되었습니다.' };
  }
}
