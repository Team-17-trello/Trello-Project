import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { itemsEntity } from './entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([itemsEntity /*,Checklist*/])],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
