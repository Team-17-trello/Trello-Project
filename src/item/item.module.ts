import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from './entities/item.entity';
import { ChecklistEntity } from 'src/checklist/entities/checklist.entity';
import { BoardEntity } from '../board/entities/board.entity';
import { ListEntity } from '../list/entities/list.entity';
import { CardEntity } from '../card/entities/card.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';
import { CommentEntity } from '../comment/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity, ChecklistEntity, BoardEntity, ListEntity, CardEntity, WorkspaceEntity, CommentEntity])],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
