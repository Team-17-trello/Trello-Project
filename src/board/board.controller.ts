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
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo-decolator';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller('boards')
@UseGuards(AuthGuard('jwt'))
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBoardDto: CreateBoardDto, @UserInfo() user: UserEntity) {
    return await this.boardService.create(createBoardDto, user);
  }

  @Get(':workspaceId')
  @HttpCode(HttpStatus.OK)
  async findAll(@Param('workspaceId', ParseIntPipe) workspaceId: number) {
    return await this.boardService.findAll(workspaceId);
  }

  @Get(':boardId')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('boardId', ParseIntPipe) boardId: number) {
    return await this.boardService.findOne(boardId);
  }

  @Patch(':boardId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
    @UserInfo() user: UserEntity,
  ) {
    return await this.boardService.update(boardId, updateBoardDto, user);
  }

  @Delete(':boardId')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('boardId', ParseIntPipe) boardId: number, @UserInfo() user: UserEntity) {
    return await this.boardService.remove(boardId, user);
  }
}
