import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from '../card/entities/card.entity';
import { CommentEntity } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardEntity, CommentEntity])],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
