import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { UserInfo } from '../utils/userInfo-decolator';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';

@ApiBearerAuth()
@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':cardId')
  create(
    @Param('cardId') id: string,
    @UserInfo() user: UserEntity,
    @Body() commentDto: CommentDto,
  ) {
    return this.commentService.create(+id, user, commentDto);
  }

  @Patch(':commentId')
  update(
    @Param('commentId') id: string,
    @UserInfo() user: UserEntity,
    @Body() commentDto: CommentDto,
  ) {
    return this.commentService.update(+id, user, commentDto);
  }

  @Delete(':commentId')
  remove(@Param('commentId') id: string, @UserInfo() user: UserEntity) {
    return this.commentService.remove(+id, user);
  }
}
