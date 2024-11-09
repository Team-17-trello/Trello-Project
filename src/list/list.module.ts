import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListEntity } from './entities/list.entity';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { BoardEntity } from 'src/board/entities/board.entity';
import { CardEntity } from 'src/card/entities/card.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';
import { MemberEntity } from '../member/entity/member.entity';
import { CommentEntity } from '../comment/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListEntity, BoardEntity, CardEntity, WorkspaceEntity, MemberEntity, CommentEntity])],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
