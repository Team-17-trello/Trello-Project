import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from 'src/board/entities/board.entity';
import { UserEntity } from 'src/user/entities/user.entity';
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

  async create(createListDto: CreateListDto, user: UserEntity): Promise<ListEntity> {
    const board = await this.boardRepository.findOne({ where: { id: createListDto.boardId } });

    if (!board) throw new NotFoundException('해당 보드를 찾을수없습니다.');
    const listCount = await this.listRepository.count({
      where: { board: { id: createListDto.boardId } },
    });

    const list = this.listRepository.create({
      ...createListDto,
      order: listCount + 1,
      userId: user.id,
      board,
    });

    return await this.listRepository.save(list);
  }

  async findAll(boardId: number): Promise<ListEntity[]> {
    const lists = await this.listRepository.find({
      where: { board: { id: boardId } },
    });

    if (lists.length === 0) throw new BadRequestException('리스트를 찾을 수 없습니다');

    return lists;
  }

  async findOne(id: number): Promise<ListEntity> {
    const list = await this.listRepository.findOne({ where: { id } });

    if (!list) throw new NotFoundException('해당 리스트를 찾을 수 없습니다.');

    return list;
  }

  async update(id: number, updateListDto: UpdateListDto, user: UserEntity): Promise<ListEntity> {
    await this.verifyListByBoardId(user.id, id);

    await this.listRepository.update({ id }, updateListDto);

    const updatedList = await this.listRepository.findOne({ where: { id } });

    return updatedList;
  }

  async remove(id: number, user: UserEntity): Promise<{ message: string }> {
    await this.verifyListByBoardId(user.id, id);

    const result = await this.listRepository.delete({ id });

    return { message: '리스트가 성공적으로 삭제되었습니다.' };
  }

  async verifyListByBoardId(userId: number, listId: number) {
    const list = await this.listRepository.findOneBy({ userId: userId, id: listId });

    if (!list) {
      throw new NotFoundException('해당 유저가 생성한 리스트 아닙니다.');
    }

    return list;
  }
}
