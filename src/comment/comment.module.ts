import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { CardEntity } from 'src/card/entities/card.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';
import { BoardEntity } from '../board/entities/board.entity';
import { ListEntity } from '../list/entities/list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, CardEntity, WorkspaceEntity, BoardEntity, ListEntity, ])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
