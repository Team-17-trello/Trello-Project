import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponsibleEntity } from 'src/card/entities/responsible.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Repository } from 'typeorm';
import { CardEntity } from '../card/entities/card.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CommentDto } from './dto/comment.dto';
import { CommentEntity } from './entities/comment.entity';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(ResponsibleEntity)
    private readonly responsibleRepository: Repository<ResponsibleEntity>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(cardId: number, user: UserEntity, commentDto: CommentDto) {
    try {
      const card = await this.cardRepository.findOne({
        where: { id: cardId },
      });
      console.log(card);
      if (!card) {
        throw new NotFoundException('해당 카드가 존재하지 않습니다.');
      }

      const comment: CommentEntity = await this.commentRepository.save({
        text: commentDto.text,
        userId: user.id,
        card: card,
      });

      const responsibles = await this.responsibleRepository.find({
        where: { card: { id: cardId } },
      });

      await Promise.all(
        responsibles.map((responsible) => {
          const message = `${responsible.userId}님 카드에 댓글이 달렸습니다.`;
          return this.notificationService.sendNotification(responsible.userId, message);
        }),
      );

      return {
        message: '댓글이 생성되었습니다.',
        comment: comment,
      };
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, user: UserEntity, commentDto: CommentDto) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id },
      });

      if (!comment) {
        throw new NotFoundException('해당 댓글이 존재하지 않습니다.');
      }

      if (comment.userId !== user.id) {
        throw new UnauthorizedException('댓글 수정 권한이 없습니다.');
      }

      comment.text = commentDto.text;

      const updatedComment = await this.commentRepository.save(comment);

      return {
        comment: updatedComment,
      };
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number, user: UserEntity) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id },
      });
      if (!comment) {
        throw new NotFoundException('해당 댓글이 존재하지 않습니다.');
      }

      if (comment.userId !== user.id) {
        throw new UnauthorizedException('댓글 삭제 권한이 없습니다.');
      }

      await this.commentRepository.delete({
        id: id,
      });

      return {
        message: '댓글이 삭제 되었습니다.',
      };
    } catch (err) {
      throw err;
    }
  }
}
