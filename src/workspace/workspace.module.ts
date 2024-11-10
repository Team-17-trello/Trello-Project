import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { MemberEntity } from 'src/member/entity/member.entity';
import { ListEntity } from '../list/entities/list.entity';
import { CardEntity } from '../card/entities/card.entity';
import { BoardEntity } from '../board/entities/board.entity';
import { CommentEntity } from '../comment/entities/comment.entity';
import { ChecklistEntity } from '../checklist/entities/checklist.entity';
import { ItemEntity } from '../item/entities/item.entity';
import { MailService } from 'src/auth/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkspaceEntity,
      UserEntity,
      BoardEntity,
      MemberEntity,
      ListEntity,
      CardEntity,
      CommentEntity,
      ChecklistEntity,
      ItemEntity,
    ]),
  ],
  providers: [WorkspaceService, MailService],
  controllers: [WorkspaceController],
})
export class WorkspaceModule {}
