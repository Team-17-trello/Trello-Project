import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo-decolator';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
@UseGuards(AuthGuard('jwt'))
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBoardDto: CreateBoardDto, @UserInfo() user: User) {
    return await this.boardService.create(createBoardDto, user);
  }

  //TODO: 수정 필요함
  @Get('/workspace/:workspaceId')
  @HttpCode(HttpStatus.OK)
  async findAll(@Param('workspaceId', ParseIntPipe) workspaceId: number) {
    return await this.boardService.findAll(workspaceId);
  }

  @Get(':boardId')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('boardId', ParseIntPipe) boardId: number) {
    return await this.boardService.findOne(boardId);
  }

  @Put(':boardId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
    @UserInfo() user: User,
  ) {
    return await this.boardService.update(boardId, updateBoardDto, user);
  }

  @Delete(':boardId')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('boardId', ParseIntPipe) boardId: number, @UserInfo() user: User) {
    return await this.boardService.remove(boardId, user);
  }
}
