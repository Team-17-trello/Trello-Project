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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberGuard } from 'src/guard/members.guard';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo-decolator';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@ApiBearerAuth()
@ApiTags('보드')
@Controller('boards')
@UseGuards(MemberGuard)
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @ApiOperation({ summary: '보드 생성' })
  @ApiResponse({
    status: 201,
    description: '보드가 성공적으로 생성되었습니다.',
    type: CreateBoardDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBoardDto: CreateBoardDto, @UserInfo() user: UserEntity) {
    return await this.boardService.create(createBoardDto, user);
  }

  @Get('/workspace/:workspaceId')
  @ApiOperation({ summary: '보드 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '보드 목록이 성공적으로 조회되었습니다.',
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Param('workspaceId', ParseIntPipe) workspaceId: number) {
    return await this.boardService.findAll(workspaceId);
  }

  @Get(':boardId')
  @ApiOperation({ summary: '보드 목록 상세 조회' })
  @ApiResponse({
    status: 200,
    description: '보드 목록상세 조회가 성공적으로 조회되었습니다.',
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('boardId', ParseIntPipe) boardId: number) {
    return await this.boardService.findOne(boardId);
  }

  @Put(':boardId')
  @ApiOperation({ summary: '보드 수정' })
  @ApiResponse({
    status: 200,
    description: '보드 수정이 성공적으로 완료되었습니다.',
    type: UpdateBoardDto,
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
    @UserInfo() user: UserEntity,
  ) {
    return await this.boardService.update(boardId, updateBoardDto, user);
  }

  @Delete(':boardId')
  @ApiOperation({ summary: '보드 삭제' })
  @ApiResponse({
    status: 200,
    description: '보드 삭제가 성공적으로 완료되었습니다.',
  })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('boardId', ParseIntPipe) boardId: number, @UserInfo() user: UserEntity) {
    return await this.boardService.remove(boardId, user);
  }
}
