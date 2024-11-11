import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationService } from 'src/notification/notification.service';
import { Repository } from 'typeorm';
import { ListEntity } from '../list/entities/list.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { DueDateDto } from './dto/duedate.dto';
import { MoveCardDto } from './dto/move-card.dto';
import { ResponsibleDto } from './dto/responsible.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardEntity } from './entities/card.entity';
import { ResponsibleEntity } from './entities/responsible.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(ListEntity)
    private readonly listRepository: Repository<ListEntity>,
    @InjectRepository(ResponsibleEntity)
    private readonly responsibleRepository: Repository<ResponsibleEntity>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(user: UserEntity, createCardDto: CreateCardDto) {
    try {
      const list = await this.listRepository.findOne({
        where: { id: createCardDto.listId },
        relations: { board: { workspace: true } },
      });

      if (!list) {
        throw new NotFoundException('존재하지 않는 리스트입니다 확인해주세요.');
      }

      const cardOrder = await this.cardRepository.findOne({
        where: {
          list: { id: list.id },
        },
        order: {
          order: 'desc',
        },
      });

      const newOrder = (cardOrder?.order ?? 0) + 1;

      const card: CardEntity = await this.cardRepository.save({
        title: createCardDto.title,
        description: createCardDto.description,
        color: createCardDto.color,
        order: newOrder,
        userId: user.id,
        list: list,
        workspace: list.board.workspace,
        comments: null,
        responsibles: null,
      });

      return {
        card: card,
      };
    } catch (err) {
      throw err;
    }
  }

  async findAll(listId: number) {
    try {
      const list = await this.listRepository.findOne({
        where: { id: listId },
      });

      console.log(list);

      if (!list) {
        throw new NotFoundException('존재하지 않는 리스트입니다 확인해주세요.');
      }

      const cards = await this.cardRepository.find({
        where: {
          list: { id: list.id },
        },
        order: {
          order: 'asc',
        },
      });

      return {
        cards: cards,
      };
    } catch (err) {
      throw err;
    }
  }

  async findOne(cardId: number) {
    try {
      const card = await this.cardRepository.findOne({
        where: {
          id: cardId,
        },
        relations: {
          responsibles: true,
          comments: true,
          checklists: { items: true },
          // file : true,
        },
      });

      if (!card) {
        throw new NotFoundException('해당하는 카드가 없습니다 확인해주세요');
      }

      return {
        card: card,
      };
    } catch (err) {
      throw err;
    }
  }

  async checkResponsible(user: UserEntity) {
    const findResponsible = await this.responsibleRepository.findOne({
      where: { userId: user.id },
    });
    return findResponsible;
  }

  async update(id: number, updateCardDto: UpdateCardDto) {
    try {
      const card = await this.cardRepository.findOne({
        where: { id },
      });

      if (!card) {
        throw new NotFoundException('해당하는 카드가 없습니다 확인해주세요');
      }

      const updateData: Partial<CardEntity> = {};

      if (updateCardDto.title) {
        updateData.title = updateCardDto.title;
      }

      if (updateCardDto.description) {
        updateData.description = updateCardDto.description;
      }

      if (updateCardDto.color) {
        updateData.color = updateCardDto.color;
      }

      await this.cardRepository.update(id, updateData);

      const updatedCard = await this.cardRepository.findOne({ where: { id } });

      return {
        message: '성공적으로 카드가 수정되었습니다.',
        updated: updatedCard,
      };
    } catch (err) {
      throw err;
    }
  }

  async setDueDate(id: number, dueDateDto: DueDateDto) {
    try {
      await this.cardRepository.update(id, { dueDate: dueDateDto.dueDate });

      return {
        message: `마감 기한이 설정 됐습니다. ${dueDateDto.dueDate}`,
        dueDate: dueDateDto.dueDate,
      };
    } catch (err) {
      throw err;
    }
  }

  async inviteResponsible(cardId: number, responsibleDto: ResponsibleDto) {
    try {
      const card = await this.cardRepository.findOne({
        where: { id: cardId },
      });
      if (!card) {
        throw new NotFoundException('해당하는 카드가 없습니다 확인해주세요');
      }

      await Promise.all(
        responsibleDto.responsibles.map((responsible) =>
          this.responsibleRepository.save({
            card: { id: cardId },
            userId: responsible,
          }),
        ),
      );

      await Promise.all(
        responsibleDto.responsibles.map((responsible) => {
          const message = `${responsible}님 초대메세지가 도착했습니다.`;
          return this.notificationService.sendNotification(responsible, message);
        }),
      );

      return {
        message: '초대가 완료되었습니다.',
        responsible: responsibleDto.responsibles,
      };
    } catch (err) {
      throw err;
    }
  }

  async removeResponsible(cardId: number, id: number) {
    try {
      const card = await this.cardRepository.findOne({
        where: { id: cardId },
      });
      if (!card) {
        throw new NotFoundException('해당하는 카드가 없습니다 확인해주세요');
      }

      const findResponsible = await this.responsibleRepository.findOne({
        where: { id },
      });
      if (!findResponsible) {
        throw new NotFoundException('해당 담당자가 존재 하지 않습니다.');
      }

      await this.responsibleRepository.delete({
        id: id,
      });

      return {
        message: '담당자가 삭제되었습니다.',
      };
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number) {
    try {
      const card = await this.cardRepository.findOne({
        where: { id: id },
      });

      if (!card) {
        throw new NotFoundException('해당하는 카드가 없습니다 확인해주세요');
      }

      await this.cardRepository.delete({
        id: id,
      });

      return {
        message: '카드가 삭제 되었습니다.',
      };
    } catch (err) {
      throw err;
    }
  }

  async moveCard(id: number, moveCardDto: MoveCardDto) {
    try {
      let newOrder = 0;

      const card = await this.cardRepository.findOne({
        where: { id: id },
      });

      const cards = await this.cardRepository.find({
        where: { list: { id: moveCardDto.listId } },
        order: { order: 'ASC' },
      });

      if (cards.length === 0) {
        newOrder = 1;
        const list = await this.listRepository.findOne({
          where: { id: moveCardDto.listId },
        });

        if (!list) {
          throw new NotFoundException('존재하지 않는 리스트입니다.');
        }

        card.order = newOrder;
        card.list = list;

        await this.cardRepository.save(card);

        return {
          message: '카드 위치가 변경되었습니다.',
        };
      }

      if (moveCardDto.order === 1) {
        newOrder = cards[0].order / 2;
      } else if (moveCardDto.order >= cards.length) {
        newOrder = cards[cards.length - 1].order + 1;
      } else if (moveCardDto.order > card.order) {
        const targetOrder = cards[moveCardDto.order].order;

        const preTargetOrder = cards[moveCardDto.order - 1].order;

        newOrder = (targetOrder + preTargetOrder) / 2;
      } else {
        const targetOrder = cards[moveCardDto.order - 1].order;

        const preTargetOrder = cards[moveCardDto.order - 2].order;

        newOrder = (targetOrder + preTargetOrder) / 2;
      }

      const list = await this.listRepository.findOne({
        where: { id: moveCardDto.listId },
      });
      console.log(list);
      if (!list) {
        throw new NotFoundException('존재하지 않는 리스트입니다.');
      }

      card.order = newOrder;
      card.list = list;

      await this.cardRepository.save(card);

      return {
        message: '카드 위치가 변경되었습니다.',
      };
    } catch (err) {
      throw err;
    }
  }
}
