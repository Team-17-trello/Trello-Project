import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardEntity } from '../board/entities/board.entity';
import { CardEntity } from '../card/entities/card.entity';
import { ChecklistEntity } from '../checklist/entities/checklist.entity';
import { CommentEntity } from '../comment/entities/comment.entity';
import { ItemEntity } from '../item/entities/item.entity';
import { ListEntity } from '../list/entities/list.entity';
import { MemberEntity } from '../member/entity/member.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';
import { FileEntity } from './entities/file.entity';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentEntity,
      CardEntity,
      WorkspaceEntity,
      BoardEntity,
      ListEntity,
      ChecklistEntity,
      ItemEntity,
      CommentEntity,
      FileEntity,
      MemberEntity,
    ]),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
