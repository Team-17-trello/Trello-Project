import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListEntity } from './entities/list.entity';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { BoardEntity } from 'src/board/entities/board.entity';
import { CardEntity } from 'src/card/entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListEntity, BoardEntity, CardEntity])],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
