import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from 'src/card/entities/card.entity';
import { FileEntity } from 'src/file/entities/file.entity';
import { MemberEntity } from 'src/member/entity/member.entity';
import { BoardEntity } from '../board/entities/board.entity';
import { CommentEntity } from '../comment/entities/comment.entity';
import { ItemEntity } from '../item/entities/item.entity';
import { ListEntity } from '../list/entities/list.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { ChecklistEntity } from './entities/checklist.entity';

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
