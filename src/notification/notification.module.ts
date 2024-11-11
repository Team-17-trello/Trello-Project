import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from 'src/item/entities/item.entity';
import { ChecklistEntity } from 'src/checklist/entities/checklist.entity';
import { BoardEntity } from 'src/board/entities/board.entity';
import { ListEntity } from 'src/list/entities/list.entity';
import { CardEntity } from 'src/card/entities/card.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ItemEntity,
      ChecklistEntity,
      BoardEntity,
      ListEntity,
      CardEntity,
      WorkspaceEntity,
      CommentEntity,
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
