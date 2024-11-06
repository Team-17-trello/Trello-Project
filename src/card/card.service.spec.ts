import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Responsible } from './entities/responsible.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';

describe('CardService', () => {
  let cardService: CardService;
  let cardRepository: Repository<Card>;
  let responsibleRepository: Repository<Responsible>;
  let listRepository: Repository<List>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        {
          provide: getRepositoryToken(Card),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(List),
          useValue: {
            findOne: jest.fn,
          },
        },
        {
          provide: getRepositoryToken(Responsible),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    cardService = module.get<CardService>(CardService);
    cardRepository = module.get<Repository<Card>>(getRepositoryToken(Card));
    listRepository = module.get<Repository<List>>(getRepositoryToken(List));
    responsibleRepository = module.get<Repository<Responsible>>(getRepositoryToken(Responsible));

  });

  describe('create Card', () => {

    it('존재하지 않는 리스트 아이디를 받으면 NotFoundException 을 던짐', async () => {
      jest.spyOn(listRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(cardService.create(new User(), {
        listId: 1,
        title: 'test',
        description: 'test',
        color: 'test',
        dueDate: new Date(),
      })).rejects.toThrow(NotFoundException);
      expect(listRepository.findOne).toHaveBeenCalledWith({ where: 1 });
      expect(listRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('카드 생성에 성공하면 status 코드 201과 카드 객체를 리턴', async () => {
      // 1. 리스트 존재 확인
      const mockList = new List();
      jest.spyOn(listRepository, 'findOne').mockResolvedValueOnce(mockList);

      // 2. 리스트 아이디가 동일한 카드 배열의 길이 확인
      const mockCards = [new Card(), new Card()]; // 리스트에 이미 존재하는 카드 2개
      jest.spyOn(cardRepository, 'find').mockResolvedValueOnce(mockCards);

      // 3. 카드 저장
      const mockCard = {
        id: 1,
        title: 'Test Title',
        description: 'Test Description',
        color: 'blue',
        order: 3, // 새로운 카드의 order는 mockCards.length + 1
        author: 1, // user.id (테스트에서는 간단히 1로 가정)
        list: mockList,
      };
      jest.spyOn(cardRepository, 'save').mockResolvedValueOnce(mockCard as Card);

      // 4. 카드 생성 메서드 호출 및 결과 검증
      const result = await cardService.create(
        { id: 1 } as User, // 사용자 객체를 간단히 id만 포함해서 전달
        {
          title: 'Test Title',
          description: 'Test Description',
          color: 'blue',
          listId: 1,
        } as CreateCardDto,
      );

      // 결과가 status 코드 201과 생성한 card 객체를 포함하는지 확인
      expect(result).toEqual({
        status: 201,
        card: mockCard,
      });

      // 추가적인 호출 확인
      expect(listRepository.findOne).toHaveBeenCalledWith({ where: 1 });
      expect(cardRepository.find).toHaveBeenCalledWith({ where: { list: mockList } });
      expect(cardRepository.save).toHaveBeenCalledWith({
        title: 'Test Title',
        description: 'Test Description',
        color: 'blue',
        order: 3, // mockCards.length + 1
        author: 1, // user.id
        list: mockList,
      });
    });


    describe('findAll Card', () => {
      it('존재하지 않는 리스트 아이디를 받으면 NotFoundException 을 던짐', async () => {
        jest.spyOn(listRepository, 'findOne').mockResolvedValueOnce(null);

        await expect(cardService.findAll(1)).rejects.toThrow(NotFoundException);
        expect(listRepository.findOne).toHaveBeenCalledWith({ where: 1 });
        expect(listRepository.findOne).toHaveBeenCalledTimes(1);
      });


      it('리스트가 존재하고 카드 조회에 성공한 경우 status 코드 200과 카드 배열 리턴', async () => {
        // 1. 리스트 존재 확인
        const mockList = new List();
        jest.spyOn(listRepository, 'findOne').mockResolvedValueOnce(mockList);

        // 2. 리스트 아이디가 동일한 카드 배열의 길이 확인
        const mockCards = [new Card(), new Card()]; // 리스트에 이미 존재하는 카드 2개
        jest.spyOn(cardRepository, 'find').mockResolvedValueOnce(mockCards);

        // 3. 카드 전체 조회 메서드 호출 및 결과 검증
        const result = await cardService.findAll(1);

        // 결과가 status 코드 200과 생성한 card 객체를 포함하는지 확인
        expect(result).toEqual({
          status: 200,
          cards: mockCards,
        });

        // 추가적인 호출 확인
        expect(listRepository.findOne).toHaveBeenCalledWith({ where: 1 });
        expect(listRepository.findOne).toHaveBeenCalledTimes(1);
        expect(cardRepository.find).toHaveBeenCalledWith({ where: { list: mockList } })
        expect(cardRepository.find).toHaveBeenCalledTimes(1);
      });
    });

    describe('findOne Card', () => {

      it('카드 아이디에 해당하는 카드가 없으면 NotFoundException 던짐', async () => {
        jest.spyOn(cardRepository, 'findOne').mockResolvedValueOnce(null);

        await expect(cardService.findOne(1)).rejects.toThrow(NotFoundException);
        expect(cardRepository.findOne).toHaveBeenCalledWith({ where: 1 });
        expect(cardRepository.findOne).toHaveBeenCalledTimes(1);
      });

      it('아이디에 해당하는 카드가 존재하고 카드 조회에 성공한 경우 status 코드 200과 카드 객체 리턴', async () => {
        const mockCard = new Card()
        mockCard.id = 1;
        mockCard.responsible = [];
        jest.spyOn(cardRepository, 'findOne').mockResolvedValueOnce(mockCard);

        const result = await cardService.findOne(1);

        expect(result).toEqual({
          status: 200,
          card: mockCard,
        });

        expect(cardRepository.findOne).toHaveBeenCalledWith({
          where: { id: 1 },
          relations: { responsible: true},
        });
        expect(cardRepository.findOne).toHaveBeenCalledTimes(1);

      });
    });


    describe('update Card', () => {

      it('해당 하는 카드 아이디 없을 시 NotFoundException 반환', async () => {
        const mockUpdateCardDto = {
          title: 'test',
          description: 'test',
          color: 'black',
        };
        jest.spyOn(cardService['cardRepository'], 'findOne').mockResolvedValue(null);

        await expect(cardService.update(1, mockUpdateCardDto)).rejects.toThrow(NotFoundException);
      });

      it('카드 수정 성공 시 카드 수정 결과 반환', async () => {
        const mockUpdateCardDto = {
          title: 'test',
          description: 'test',
          color: 'black',
        };

        const mockCard = {
          id: 1,
          title: 'original title',
          description: 'original description',
          color: 'red',
          order: 1,
          dueDate: new Date(),
          author: 1,
        };

        const updatedCard = { ...mockCard, ...mockUpdateCardDto };
        jest.spyOn(cardService['cardRepository'], 'findOne').mockResolvedValue(mockCard as any);

        jest.spyOn(cardService['cardRepository'], 'update').mockResolvedValue({ affected: 1 } as any);


        const result = await cardService.update(1, mockUpdateCardDto);
        const date = mockCard.dueDate;
        expect(result).toEqual({
          statusCode: 200,
          message: '성공적으로 카드가 수정되었습니다.',
          updated: updatedCard,
        });

        await expect(cardService.update(1, mockUpdateCardDto)).rejects.toThrow(NotFoundException);
      });
    });

    describe('set DueDae', () => {

      it('마감 기한 설정 성공 시 성공메시지 및 기한 반환', async () => {
        const mockDueDateDto = { dueDate: new Date('2024-12-31') };
        jest.spyOn(cardRepository, 'update').mockResolvedValue({ affected: 1 } as any);

        const result = await cardService.setDueDate(1, mockDueDateDto);

        expect(result).toEqual({
          statusCode: 200,
          message: `마감 기한이 설정 됐습니다. ${mockDueDateDto.dueDate}`,
          dueDate: mockDueDateDto.dueDate,
        });
      });
    });

    describe('remove Card', () => {

      it('해당 카드가 존재 하지 않으면 NotFoundException 반환', async () => {
        jest.spyOn(cardRepository, 'findOne').mockResolvedValue(null);
        await expect(cardService.remove(1)).rejects.toThrow(NotFoundException);

      });

      it('해당 카드 삭제 시 메시지 반환', async () => {
        const mockCard = {
          id: 1,
          title: 'original title',
          description: 'original description',
          color: 'red',
          order: 1,
          dueDate: new Date(),
          author: 1,
        };

        jest.spyOn(cardService['cardRepository'], 'findOne').mockResolvedValue(mockCard as any);
        jest.spyOn(cardService['cardRepository'], 'delete').mockResolvedValue({ affectd: 1 } as any)

        const result = await cardService.remove(1)

        expect(result).toEqual({
          status: 200,
          message: '카드가 삭제 되었습니다.',
        });
      });
    });

    describe('invite Responsible', () => {

      it('해당 카드가 존재 하지 않으면 NotFoundException 반환', async () => {
        jest.spyOn(cardRepository, 'findOne').mockResolvedValue(null);
        const mockResponsibleDto = { responsibles: [1, 2] }
        await expect(cardService.inviteResponsible(1, mockResponsibleDto)).rejects.toThrow(NotFoundException);

      });

      it('담당자 초대 성공 시 결과 반환 ', async () => {
        const mockCard = {
          id: 1,
          title: 'original title',
          description: 'original description',
          color: 'red',
          order: 1,
          dueDate: new Date(),
          author: 1,
        };

        const mockResponsibleDto = { responsibles: [1, 2] }

        jest.spyOn(cardRepository, 'findOne').mockResolvedValue(mockCard as any)
        jest.spyOn(responsibleRepository, 'save').mockResolvedValue(undefined)

        const result = await cardService.inviteResponsible(1, mockResponsibleDto)

        expect(result).toEqual({
          stateCode: 201,
          message: '초대가 완료되었습니다.',
          responsible: mockResponsibleDto.responsibles
        })
      })
    });

    describe('remove Responsible', () => {


      it('해당 카드가 존재 하지 않으면 NotFoundException 반환', async () => {
        jest.spyOn(cardRepository, 'findOne').mockResolvedValue(null);
        await expect(cardService.removeResponsible(1,1)).rejects.toThrow(NotFoundException);

      });

      it('해당 담당자가 존재 하지 않으면 NotFoundException 반환', async () => {
        const mockCard = {
          id: 1,
          title: 'original title',
          description: 'original description',
          color: 'red',
          order: 1,
          dueDate: new Date(),
          author: 1,
        };

        jest.spyOn(cardRepository, 'findOne').mockResolvedValue(mockCard as any)
        jest.spyOn(responsibleRepository, 'findOne').mockResolvedValue(null)

        await expect(cardService.removeResponsible(1, 1)).rejects.toThrow(NotFoundException);


      });

      it('카드, 담당자 존재 시 담당자 삭제', async () => {
        const mockCard = {
          id: 1,
          title: 'original title',
          description: 'original description',
          color: 'red',
          order: 1,
          dueDate: new Date(),
          author: 1,
        };

        const mockResponsible  = {id: 1, userId:1, card: mockCard}
        jest.spyOn(cardRepository, 'findOne').mockResolvedValue(mockCard as any)
        jest.spyOn(responsibleRepository, 'findOne').mockResolvedValue(mockResponsible as any)

        jest.spyOn(responsibleRepository, 'delete').mockResolvedValue({affected: 1} as any)

        const result = await cardService.removeResponsible(1,1)

        expect(responsibleRepository.delete).toHaveBeenCalledWith({
          card: {id: mockCard.id}
        })

        expect(result).toEqual({
          statusCode:200,
          message: '담당자가 성공적으로 삭제되었습니다.'
        })

      });






    });
  });
})
