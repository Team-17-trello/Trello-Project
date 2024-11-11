import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from 'src/auth/email/email.service';
import { FileEntity } from 'src/file/entities/file.entity';
import { MemberEntity } from 'src/member/entity/member.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { BoardEntity } from '../board/entities/board.entity';
import { CardEntity } from '../card/entities/card.entity';
import { ChecklistEntity } from '../checklist/entities/checklist.entity';
import { CommentEntity } from '../comment/entities/comment.entity';
import { ItemEntity } from '../item/entities/item.entity';
import { ListEntity } from '../list/entities/list.entity';
import { WorkspaceEntity } from './entities/workspace.entity';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';

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
      FileEntity,
    ]),
  ],
  providers: [WorkspaceService, MailService],
  controllers: [WorkspaceController],
})
export class WorkspaceModule {}
