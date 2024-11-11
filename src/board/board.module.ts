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
import { ChecklistEntity } from '../checklist/entities/checklist.entity';
import { ItemEntity } from '../item/entities/item.entity';
import { FileEntity } from 'src/file/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BoardEntity,
      WorkspaceEntity,
      ListEntity,
      CardEntity,
      MemberEntity,
      CommentEntity,
      ChecklistEntity,
      ItemEntity,
      FileEntity,
    ]),
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
