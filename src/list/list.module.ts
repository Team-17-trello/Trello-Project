import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { ListEntity } from './entities/list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ListEntity])],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
