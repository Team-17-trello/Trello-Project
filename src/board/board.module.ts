import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardEntity } from './entities/board.entity';
import { WorkspaceEntity } from 'src/workspace/entities/workspace.entity';
import { ListEntity } from '../list/entities/list.entity';
import { CardEntity } from '../card/entities/card.entity';
import { MemberEntity } from '../member/entity/member.entity';
import { CommentEntity } from '../comment/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity, WorkspaceEntity, ListEntity, CardEntity, MemberEntity, CommentEntity])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
