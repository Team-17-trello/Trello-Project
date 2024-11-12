import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberGuard } from '../guard/members.guard';
import { UserEntity } from '../user/entities/user.entity';
import { UserInfo } from '../utils/userInfo-decolator';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';

@ApiBearerAuth()
@ApiTags('코멘트')
@Controller('comments')
@UseGuards(MemberGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':cardId')
  @ApiOperation({ summary: '댓글 작성' })
  @ApiResponse({ status: 201, description: '댓글이 성공적으로 생성됨', type: CommentDto })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('cardId') id: string,
    @UserInfo() user: UserEntity,
    @Body() commentDto: CommentDto,
  ) {
    return this.commentService.create(+id, user, commentDto);
  }

  @Patch(':commentId')
  @ApiOperation({ summary: '댓글 수정' })
  @ApiResponse({ status: 200, description: '댓글이 성공적으로 수정됨', type: CommentDto })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('commentId') id: string,
    @UserInfo() user: UserEntity,
    @Body() commentDto: CommentDto,
  ) {
    return this.commentService.update(+id, user, commentDto);
  }

  @Delete(':commentId')
  @ApiOperation({ summary: '댓글 삭제' })
  @ApiResponse({ status: 200, description: '댓글이 성공적으로 삭제됨', type: CommentDto })
  @HttpCode(HttpStatus.OK)
  remove(@Param('commentId') id: string, @UserInfo() user: UserEntity) {
    return this.commentService.remove(+id, user);
  }
}
