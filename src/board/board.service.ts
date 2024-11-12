import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { UserEntity } from 'src/user/entities/user.entity';
import { WorkspaceEntity } from 'src/workspace/entities/workspace.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardEntity } from './entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
  ) {}

  async create(createBoardDto: CreateBoardDto, user: UserEntity): Promise<BoardEntity> {
    try {
      const workspace = await this.workspaceRepository.findOne({
        where: { id: createBoardDto.workspaceId },
      });

      if (!workspace) {
        throw new NotFoundException('존재하지 않는 워크스페이스입니다.');
      }

      const board: BoardEntity = this.boardRepository.create({
        name: createBoardDto.name,
        description: createBoardDto.description,
        backgroundColor: createBoardDto.backgroundColor,
        workspace: workspace,
        userId: user.id,
      });

      return await this.boardRepository.save(board);
    } catch (err) {
      throw err;
    }
  }

  async findAll(workspaceId: number): Promise<{ boards: BoardEntity[] }> {
    try {
      const workspace = await this.workspaceRepository.findOne({
        where: { id: workspaceId },
      });

      const boards = await this.boardRepository.find({
        where: {
          workspace: { id: workspace.id },
        },
        select: ['id', 'name', 'backgroundColor', 'description', 'userId'],
      });

      return { boards };
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: number): Promise<BoardEntity> {
    try {
      const board = await this.boardRepository.findOne({
        where: { id },
        relations: {
          lists: true,
        },
      });
      if (!board) {
        throw new NotFoundException('보드를 찾을 수 없습니다.');
      }
      return board;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, updateBoardDto: UpdateBoardDto, user: UserEntity): Promise<BoardEntity> {
    try {
      await this.verifyBoardByUserId(user.id);

      await this.authorityBoardByUserIdBoardId(user.id, id);

      const existingBoard = await this.findOne(id);

      await this.boardRepository.update(id, updateBoardDto);

      return { ...existingBoard, ...updateBoardDto };
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number, user: UserEntity): Promise<{ message: string }> {
    try {
      await this.verifyBoardByUserId(user.id);

      await this.authorityBoardByUserIdBoardId(user.id, id);

      await this.boardRepository.delete(id);

      return { message: '보드가 성공적으로 삭제되었습니다.' };
    } catch (err) {
      throw err;
    }
  }

  private async verifyBoardByUserId(userId: number) {
    const board = await this.boardRepository.findOne({
      where: { userId: userId },
    });

    if (_.isNil(board)) {
      throw new BadRequestException('보드가 존재하지 않습니다.');
    }

    return board;
  }

  private async authorityBoardByUserIdBoardId(userId: number, boardId: number) {
    const board = await this.boardRepository.findOneBy({ userId: userId, id: boardId });
    if (_.isNil(board)) {
      throw new BadRequestException('해당 유저는 보드에 대한 권한이 없습니다.');
    }
    return board;
  }
}
