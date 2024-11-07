import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardEntity } from './entities/board.entity';
import { WorkspaceEntity } from 'src/workspace/entities/workspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity, WorkspaceEntity])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
