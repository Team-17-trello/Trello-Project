import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardEntity } from 'src/board/entities/board.entity';
import { CardEntity } from 'src/card/entities/card.entity';
import { FileEntity } from 'src/file/entities/file.entity';
import { ChecklistEntity } from '../checklist/entities/checklist.entity';
import { CommentEntity } from '../comment/entities/comment.entity';
import { ItemEntity } from '../item/entities/item.entity';
import { MemberEntity } from '../member/entity/member.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';
import { ListEntity } from './entities/list.entity';
import { ListController } from './list.controller';
import { ListService } from './list.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ListEntity,
      BoardEntity,
      CardEntity,
      WorkspaceEntity,
      MemberEntity,
      CommentEntity,
      ChecklistEntity,
      ItemEntity,
      FileEntity,
    ]),
  ],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
