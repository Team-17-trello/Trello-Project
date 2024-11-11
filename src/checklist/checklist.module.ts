import { Module } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { ChecklistController } from './checklist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistEntity } from './entities/checklist.entity';
import { CardEntity } from 'src/card/entities/card.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';
import { BoardEntity } from '../board/entities/board.entity';
import { ListEntity } from '../list/entities/list.entity';
import { CommentEntity } from '../comment/entities/comment.entity';
import { ItemEntity } from '../item/entities/item.entity';
import { MemberEntity } from 'src/member/entity/member.entity';
import { FileEntity } from 'src/file/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChecklistEntity,
      CardEntity,
      WorkspaceEntity,
      BoardEntity,
      ListEntity,
      CommentEntity,
      ItemEntity,
      MemberEntity,
      FileEntity,
    ]),
  ],
  controllers: [ChecklistController],
  providers: [ChecklistService],
})
export class ChecklistModule {}
