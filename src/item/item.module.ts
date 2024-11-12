import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistEntity } from 'src/checklist/entities/checklist.entity';
import { FileEntity } from 'src/file/entities/file.entity';
import { MemberEntity } from 'src/member/entity/member.entity';
import { BoardEntity } from '../board/entities/board.entity';
import { CardEntity } from '../card/entities/card.entity';
import { CommentEntity } from '../comment/entities/comment.entity';
import { ListEntity } from '../list/entities/list.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';
import { ItemEntity } from './entities/item.entity';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemEntity,
      ChecklistEntity,
      BoardEntity,
      ListEntity,
      CardEntity,
      WorkspaceEntity,
      CommentEntity,
      MemberEntity,
      FileEntity,
    ]),
  ],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
