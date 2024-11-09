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

@Module({
  imports: [TypeOrmModule.forFeature([CardEntity, ListEntity, ResponsibleEntity, WorkspaceEntity, BoardEntity, MemberEntity, CommentEntity])],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
