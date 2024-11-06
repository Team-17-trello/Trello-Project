import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Column, Repository } from 'typeorm';
import { DueDateDto } from './dto/deadline.dto';
import { ResponsibleDto } from './dto/responsible.dto';
import { User } from '../user/entities/user.entity';
import { Responsible } from './entities/responsible.entity';

@Injectable()
export class CardService {
  constructor(@InjectRepository(Card)
              private readonly cardRepository: Repository<Card>,
              private readonly listRepository: Repository<List>,
              private readonly responsibleRepository: Repository<Responsible>,
  ) {
  }

  async create(user: User, createCardDto: CreateCardDto) {
    const list = await this.listRepository.findOne({
      where: createCardDto.listId,
    });

    if (!list) {
      throw new NotFoundException('존재하지 않는 리스트입니다 확인해주세요.');
    }

    const cards = await this.cardRepository.find({
      where: {
        list: list,
      },
    });

    const card =  await this.cardRepository.save({
      title: createCardDto.title,
      description: createCardDto.description,
      color: createCardDto.color,
      order: (cards.length + 1),
      author: user.id,
      list: list,
    });

    return {
      status: 201,
      card: card,
    }
  }

  async findAll(listId: number) {
    const list = await this.listRepository.findOne({
      where: listId,
    });

    if (!list) {
      throw new NotFoundException('존재하지 않는 리스트입니다 확인해주세요.');
    }

    const cards = await this.cardRepository.find({
      where: {
        list: list,
      },
    });

    return {
      status: 200,
      cards: cards,
    };
  }

  async findOne(cardId: number) {
    const card = await this.cardRepository.findOne({
        where: {
          id: cardId,
        },
        relations: {
          responsible: true,
          // comment : true,
          // checkList : true,
          // file : true,
        },
      },
    );

    if (!card) {
      throw new NotFoundException('해당하는 카드가 없습니다 확인해주세요');
    }

    return {
      status: 200,
      card: card,
    };


  }

  async checkResponsible(user) {
    //카드 담당자 인지 확인
    const findResponsible = await this.responsibleRepository.findOne({
      where: { userId: user.id },
    });
    return findResponsible;
  }

  //카드 수정 메소드 (트랜잭션, 동시성 처리 필요)
  async update(id: number, updateCardDto: UpdateCardDto) {
    try {
      // if (!(await this.checkResponsible(user))) {
      //   throw new UnauthorizedException('카드 수정 권한이 없습니다.');
      // }

      const card = await this.cardRepository.findOne({
        where: { id },
      });

      if (!card) {
        throw new NotFoundException('해당하는 카드가 없습니다 확인해주세요');
      }

      //카드 수정
      const updateData: Partial<Card> = {};

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
        statusCode: 200,
        message: '성공적으로 카드가 수정되었습니다.',
        updated: updatedCard,
      };
    } catch (error) {
      throw error;
      console.error(error);

    }
  }

  //마감 기한 설정 메소드
  async setDueDate(id: number, dueDateDto: DueDateDto) {
    try {

      await this.cardRepository.update(id, { dueDate: dueDateDto.dueDate });

      return {
        statusCode: 200,
        message: `마감 기한이 설정 됐습니다. ${dueDateDto.dueDate}`,
        dueDate: dueDateDto.dueDate,
      };

    } catch (error) {
      throw error;
      console.error(error);

    }
  }


  //책임자
  async inviteResponsible(cardId: number, responsibleDto: ResponsibleDto) {
    try {

      const card = await this.cardRepository.findOne({
        where: { id: cardId },
      });
      if (!card) {
        throw new NotFoundException('해당하는 카드가 없습니다 확인해주세요');
      }


      responsibleDto.responsibles.map(async (responsible) => {
        await this.responsibleRepository.save({
          card:{id:cardId},
          userId: responsible,
        });
      });

      return {
        stateCode: 201,
        message: '초대가 완료되었습니다.',
        responsible: responsibleDto.responsibles,
      };

    } catch (error) {
      throw error;
      console.error(error);

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
      // @ts-ignore
      await this.responsibleRepository.delete({
        card: { id },

      });

      return {
        stateCode: 200,
        message: '담당자가 삭제되었습니다.',
      };

    } catch (error) {
      throw error;
      console.error(error);

    }

  }

  async remove(id: number) {
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
      status: 200,
      message: '카드가 삭제 되었습니다.',
    };
  }

}






