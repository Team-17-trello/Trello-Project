import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { CardEntity } from 'src/card/entities/card.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';
import { BoardEntity } from '../board/entities/board.entity';
import { ListEntity } from '../list/entities/list.entity';
import { ChecklistEntity } from '../checklist/entities/checklist.entity';
import { ItemEntity } from '../item/entities/item.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationService } from 'src/notification/notification.service';
import { ResponsibleEntity } from 'src/card/entities/responsible.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CommentEntity,
      CardEntity,
      WorkspaceEntity,
      BoardEntity,
      ListEntity,
      ChecklistEntity,
      ItemEntity,
      NotificationModule,
      ResponsibleEntity,
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService, NotificationService, RedisService],
})
export class CommentModule {}
