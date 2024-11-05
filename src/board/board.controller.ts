import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto) {
    return await this.boardService.create(createBoardDto);
  }

  @Get()
  async findAll() {
    return await this.boardService.findAll();
  }

  @Get(':boardId')
  async findOne(@Query('boardId') boardId: number) {
    return await this.boardService.findOne(boardId);
  }

  @Patch(':boardId')
  async update(@Param('boardId') boardId: number, @Body() updateBoardDto: UpdateBoardDto) {
    return await this.boardService.update(boardId, updateBoardDto);
  }

  @Delete(':boardId')
  async remove(@Param('boardId') boardId: number) {
    return await this.boardService.remove(boardId);
  }
}
