import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/file/entities/file.entity';
import { ListEntity } from 'src/list/entities/list.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationService } from 'src/notification/notification.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { BoardEntity } from '../board/entities/board.entity';
import { ChecklistEntity } from '../checklist/entities/checklist.entity';
import { CommentEntity } from '../comment/entities/comment.entity';
import { ItemEntity } from '../item/entities/item.entity';
import { MemberEntity } from '../member/entity/member.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CardEntity } from './entities/card.entity';
import { ResponsibleEntity } from './entities/responsible.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CardEntity,
      ListEntity,
      ResponsibleEntity,
      WorkspaceEntity,
      BoardEntity,
      MemberEntity,
      CommentEntity,
      ChecklistEntity,
      ItemEntity,
      NotificationModule,
      FileEntity,
    ]),
  ],
  controllers: [CardController],
  providers: [CardService, NotificationService],
})
export class CardModule {}
