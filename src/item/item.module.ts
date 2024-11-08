import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { itemsEntity } from './entities/item.entity';
import { ChecklistEntity } from 'src/checklist/entities/checklist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([itemsEntity, ChecklistEntity])],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
