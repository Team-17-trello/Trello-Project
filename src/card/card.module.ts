import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { CardEntity } from './entities/card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListEntity } from 'src/list/entities/list.entity';
import { ResponsibleEntity } from './entities/responsible.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardEntity, ListEntity, ResponsibleEntity])],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
