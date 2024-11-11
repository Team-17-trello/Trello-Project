import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardEntity } from 'src/board/entities/board.entity';
import { CardEntity } from 'src/card/entities/card.entity';
import { ChecklistEntity } from 'src/checklist/entities/checklist.entity';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { ItemEntity } from 'src/item/entities/item.entity';
import { ListEntity } from 'src/list/entities/list.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

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
