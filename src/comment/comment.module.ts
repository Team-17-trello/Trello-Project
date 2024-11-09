import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { CardEntity } from 'src/card/entities/card.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationService } from 'src/notification/notification.service';
import { ResponsibleEntity } from 'src/card/entities/responsible.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, CardEntity, ResponsibleEntity, NotificationModule]),
  ],
  controllers: [CommentController],
  providers: [CommentService, NotificationService],
})
export class CommentModule {}
