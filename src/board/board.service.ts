import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardEntity } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<BoardEntity> {
    const board = this.boardRepository.create(createBoardDto);
    return await this.boardRepository.save(board);
  }

  async findAll(): Promise<{ boards: BoardEntity[] }> {
    const boards = await this.boardRepository.find({
      select: ['id', 'name', 'backgroundColor', 'description'],
    });
    return { boards };
  }

  async findOne(id: number): Promise<BoardEntity> {
    const board = await this.boardRepository.findOne({
      where: { id },
      // relations: {
      //   // lists: {
      //   //   cards: true,
      //   // },
      // },
    });
    if (!board) {
      throw new NotFoundException('보드를 찾을 수 없습니다.');
    }
    return board;
  }

  async update(id: number, updateBoardDto: UpdateBoardDto): Promise<BoardEntity> {
    const existingBoard = await this.findOne(id);
    await this.boardRepository.update(id, updateBoardDto);
    return { ...existingBoard, ...updateBoardDto };
  }

  //TODO: 생성한 사용자만 삭제 가능 추가
  async remove(id: number): Promise<{ message: string }> {
    const result = await this.boardRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('보드를 찾을 수 없습니다.');
    }
    return { message: '보드가 성공적으로 삭제되었습니다.' };
  }
}
