import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from 'src/card/entities/card.entity';
import { ResponsibleEntity } from 'src/card/entities/responsible.entity';
import { FileEntity } from 'src/file/entities/file.entity';
import { MemberEntity } from 'src/member/entity/member.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationService } from 'src/notification/notification.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { BoardEntity } from '../board/entities/board.entity';
import { ChecklistEntity } from '../checklist/entities/checklist.entity';
import { ItemEntity } from '../item/entities/item.entity';
import { ListEntity } from '../list/entities/list.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentEntity } from './entities/comment.entity';

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
      MemberEntity,
      FileEntity,
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService, NotificationService],
})
export class CommentModule {}
