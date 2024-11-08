import { Module } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { ChecklistController } from './checklist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistEntity } from './entities/checklist.entity';
import { CardEntity } from 'src/card/entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistEntity, CardEntity])],
  controllers: [ChecklistController],
  providers: [ChecklistService],
})
export class ChecklistModule {}
