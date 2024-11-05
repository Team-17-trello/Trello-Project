import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBoardDto: CreateBoardDto) {
    return await this.boardService.create(createBoardDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.boardService.findAll();
  }

  @Get(':boardId')
  @HttpCode(HttpStatus.OK)
  async findOne(@Query('boardId') boardId: number) {
    return await this.boardService.findOne(boardId);
  }

  @Patch(':boardId')
  @HttpCode(HttpStatus.OK)
  async update(@Query('boardId') boardId: number, @Body() updateBoardDto: UpdateBoardDto) {
    return await this.boardService.update(boardId, updateBoardDto);
  }

  @Delete(':boardId')
  @HttpCode(HttpStatus.OK)
  async remove(@Query('boardId') boardId: number) {
    return await this.boardService.remove(boardId);
  }
}
