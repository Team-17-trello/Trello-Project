import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../comment/entities/comment.entity';
import { CardEntity } from '../card/entities/card.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';
import { BoardEntity } from '../board/entities/board.entity';
import { ListEntity } from '../list/entities/list.entity';
import { FileEntity } from './entities/file.entity';
import { ChecklistEntity } from '../checklist/entities/checklist.entity';
import { ItemEntity } from '../item/entities/item.entity';
import { MemberEntity } from '../member/entity/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, CardEntity, WorkspaceEntity, BoardEntity, ListEntity,ChecklistEntity, ItemEntity, CommentEntity, FileEntity, MemberEntity ])],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
