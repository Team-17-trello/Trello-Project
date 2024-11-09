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

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity, UserEntity,BoardEntity, MemberEntity, ListEntity, CardEntity, CommentEntity])],
  providers: [WorkspaceService],
  controllers: [WorkspaceController],
})
export class WorkspaceModule {}
