import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardEntity } from './entities/board.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
    @InjectRepository(WorkspaceEntity)
    private readonly workRepository: Repository<WorkspaceEntity>
  ) {}

  async create(createBoardDto: CreateBoardDto, user: UserEntity): Promise<BoardEntity> {
    const workspace = await this.workRepository.findOne({
      where: { id: createBoardDto.workspaceId },
    });

    if (!workspace){
      throw new NotFoundException('존재하지 않는 워크스페이스입니다.');
    }

    const board : BoardEntity = this.boardRepository.create({
      name : createBoardDto.name,
      description : createBoardDto.description,
      backgroundColor: createBoardDto.backgroundColor,
      workspace : workspace,
      userId: user.id,
    });
    return await this.boardRepository.save(board);
  }

  async findAll(workspaceId: number): Promise<{ boards: BoardEntity[] }> {
    const boards = await this.boardRepository.find({
      where: {
        workspace: { id: workspaceId },
      },
      select: ['id', 'name', 'backgroundColor', 'description'],
    });
    return { boards };
  }

  async findOne(id: number): Promise<BoardEntity> {
    const board = await this.boardRepository.findOne({
      where: { id },
      relations: {
        lists: {
          cards: true,
        },
      },
    });
    if (!board) {
      throw new NotFoundException('보드를 찾을 수 없습니다.');
    }
    return board;
  }

  async update(id: number, updateBoardDto: UpdateBoardDto, user: UserEntity): Promise<BoardEntity> {
    await this.verifyBoardByUserId(user.id, id);

    const existingBoard = await this.findOne(id);

    await this.boardRepository.update(id, updateBoardDto);

    return { ...existingBoard, ...updateBoardDto };
  }

  async remove(id: number, user: UserEntity): Promise<{ message: string }> {
    await this.verifyBoardByUserId(user.id, id);

    await this.boardRepository.delete(id);

    return { message: '보드가 성공적으로 삭제되었습니다.' };
  }

  async verifyBoardByUserId(userId: number, boardId: number) {
    const board = await this.boardRepository.findOneBy({ userId: userId, id: boardId });
    if (_.isNil(board)) {
      throw new BadRequestException('해당 유저가 생성한 보드가 아닙니다.');
    }
    return board;
  }
}
