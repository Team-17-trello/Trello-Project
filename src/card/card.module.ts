import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { CardEntity } from './entities/card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListEntity } from 'src/list/entities/list.entity';
import { ResponsibleEntity } from './entities/responsible.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';
import { BoardEntity } from '../board/entities/board.entity';
import { MemberEntity } from '../member/entity/member.entity';
import { CommentEntity } from '../comment/entities/comment.entity';
import { ChecklistEntity } from '../checklist/entities/checklist.entity';
import { ItemEntity } from '../item/entities/item.entity';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationModule } from 'src/notification/notification.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { RedisService } from '@liaoliaots/nestjs-redis';

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
    ]),
  ],
  controllers: [CardController],
  providers: [CardService, NotificationService, RedisService],
})
export class CardModule {}
