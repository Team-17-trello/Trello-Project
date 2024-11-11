import { RedisService } from '@liaoliaots/nestjs-redis';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BoardEntity } from 'src/board/entities/board.entity';
import { NotificationService } from 'src/notification/notification.service';
import { WorkspaceEntity } from 'src/workspace/entities/workspace.entity';
import { Repository } from 'typeorm';
import { ListEntity } from '../list/entities/list.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { CardEntity } from './entities/card.entity';
import { ResponsibleEntity } from './entities/responsible.entity';

describe('CardService', () => {
  let cardService: CardService;
  let cardRepository: Repository<CardEntity>;
  let responsibleRepository: Repository<ResponsibleEntity>;
  let listRepository: Repository<ListEntity>;
  let notificationService: NotificationService;
  let userRepository: Repository<UserEntity>;
  let redisService: RedisService;
  let mockRedisClient: any;

  mockRedisClient = {
    xadd: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        NotificationService,
        {
          provide: getRepositoryToken(CardEntity),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ListEntity),
          useValue: {
            findOne: jest.fn,
          },
        },
        {
          provide: getRepositoryToken(ResponsibleEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },

        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            getOrThrow: jest.fn(),
          },
        },
      ],
    }).compile();

    cardService = module.get<CardService>(CardService);
    notificationService = module.get<NotificationService>(NotificationService);
    cardRepository = module.get<Repository<CardEntity>>(getRepositoryToken(CardEntity));
    listRepository = module.get<Repository<ListEntity>>(getRepositoryToken(ListEntity));
    responsibleRepository = module.get<Repository<ResponsibleEntity>>(
      getRepositoryToken(ResponsibleEntity),
    );
    redisService = module.get<RedisService>(RedisService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  describe('create Card', () => {
    it('존재하지 않는 리스트 아이디를 받으면 NotFoundException 을 던짐', async () => {
      jest.spyOn(listRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        cardService.create(new UserEntity(), {
          listId: 1,
          title: 'test',
          description: 'test',
          color: 'test',
          dueDate: new Date(),
        }),
      ).rejects.toThrow(NotFoundException);

      expect(listRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { board: { workspace: true } },
      });

      expect(listRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('카드 생성에 성공하면 status 코드 201과 카드 객체를 리턴', async () => {
      // 1. 리스트 존재 확인을 위한 mockList 정의
      const mockWorkspace = {
        id: 1,
        workspaceName: 'Test Workspace',
      } as WorkspaceEntity;

      const mockBoard = {
        id: 1,
        name: 'Test Board',
        workspace: mockWorkspace,
      } as BoardEntity;

      const mockList = {
        id: 1,
        name: 'Test List',
        board: mockBoard,
      } as ListEntity;

      jest.spyOn(listRepository, 'findOne').mockResolvedValueOnce(mockList);

      // 2. 리스트 아이디가 동일한 카드 배열의 길이 확인
      const mockCards = [new CardEntity(), new CardEntity()]; // 리스트에 이미 존재하는 카드 2개
      jest.spyOn(cardRepository, 'find').mockResolvedValueOnce(mockCards);

      // 3. 카드 저장을 위한 mockCard 정의
      const mockCard: CardEntity = {
        id: 1,
        title: 'Test Title',
        description: 'Test Description',
        color: 'blue',
        order: 3, // 새로운 카드의 order는 mockCards.length + 1
        userId: 1,
        list: mockList,
        workspace: mockWorkspace,
        createdAt: new Date(),
        updatedAt: null,
        dueDate: null,
        responsibles: null,
        comments: null,
        checklists: null,
        files: null,
      };

      jest.spyOn(cardRepository, 'save').mockResolvedValueOnce(mockCard);

      // 4. 카드 생성 메서드 호출 및 결과 검증
      const result = await cardService.create(
        { id: 1 } as UserEntity, // 사용자 객체를 간단히 id만 포함해서 전달
        {
          title: 'Test Title',
          description: 'Test Description',
          color: 'blue',
          listId: 1,
        } as CreateCardDto,
      );

      // 결과가 status 코드 201과 생성한 card 객체를 포함하는지 확인
      expect(result).toEqual({
        card: mockCard,
      });

      // 추가적인 호출 확인
      expect(listRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { board: { workspace: true } },
      });
      expect(cardRepository.save).toHaveBeenCalledWith({
        title: 'Test Title',
        description: 'Test Description',
        color: 'blue',
        order: 1, // mockCards.length + 1
        responsibles: null,
        comments: null,
        userId: 1,
        list: mockList,
        workspace: mockWorkspace,
      });
    });
  });

  describe('findAll Card', () => {
    it('존재하지 않는 리스트 아이디를 받으면 NotFoundException 을 던짐', async () => {
      jest.spyOn(listRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(cardService.findAll(1)).rejects.toThrow(NotFoundException);
      expect(listRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(listRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('리스트가 존재하고 카드 조회에 성공한 경우 status 코드 200과 카드 배열 리턴', async () => {
      // 1. 리스트 존재 확인
      const mockList = new ListEntity();
      jest.spyOn(listRepository, 'findOne').mockResolvedValueOnce(mockList);

      // 2. 리스트 아이디가 동일한 카드 배열의 길이 확인
      const mockCards = [new CardEntity(), new CardEntity()]; // 리스트에 이미 존재하는 카드 2개
      jest.spyOn(cardRepository, 'find').mockResolvedValueOnce(mockCards);

      // 3. 카드 전체 조회 메서드 호출 및 결과 검증
      const result = await cardService.findAll(1);

      // 결과가 status 코드 200과 생성한 card 객체를 포함하는지 확인
      expect(result).toEqual({
        cards: mockCards,
      });

      // 추가적인 호출 확인
      expect(listRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(listRepository.findOne).toHaveBeenCalledTimes(1);
      expect(cardRepository.find).toHaveBeenCalledWith({
        where: { list: mockList },
        order: { order: 'asc' },
      });
      expect(cardRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne Card', () => {
    it('카드 아이디에 해당하는 카드가 없으면 NotFoundException 던짐', async () => {
      jest.spyOn(cardRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(cardService.findOne(1)).rejects.toThrow(NotFoundException);
      expect(cardRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { responsibles: true, comments: true, checklists: { items: true } },
      });
      expect(cardRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('아이디에 해당하는 카드가 존재하고 카드 조회에 성공한 경우 status 코드 200과 카드 객체 리턴', async () => {
      const mockCard = new CardEntity();
      mockCard.id = 1;
      mockCard.responsibles = [];
      jest.spyOn(cardRepository, 'findOne').mockResolvedValueOnce(mockCard);

      const result = await cardService.findOne(1);

      expect(result).toEqual({
        card: mockCard,
      });

      expect(cardRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { responsibles: true, comments: true, checklists: { items: true } },
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
        dueDate: new Date('2024-11-06T10:49:31.641Z'),
        userId: 1,
      };

      const updatedCard = { ...mockCard, ...mockUpdateCardDto };
      jest
        .spyOn(cardRepository, 'findOne')
        .mockResolvedValueOnce(mockCard as CardEntity)
        .mockResolvedValueOnce(updatedCard as CardEntity);
      jest.spyOn(cardRepository, 'update').mockResolvedValue({ affected: 1 } as any);

      const result = await cardService.update(1, mockUpdateCardDto);
      expect(result).toEqual({
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
        userId: 1,
      };

      jest
        .spyOn(cardService['cardRepository'], 'findOne')
        .mockResolvedValue(mockCard as CardEntity);
      jest.spyOn(cardService['cardRepository'], 'delete').mockResolvedValue({ affected: 1 } as any);

      const result = await cardService.remove(1);

      expect(result).toEqual({
        message: '카드가 삭제 되었습니다.',
      });
    });
  });

  describe('invite Responsible', () => {
    it('해당 카드가 존재 하지 않으면 NotFoundException 반환', async () => {
      jest.spyOn(cardRepository, 'findOne').mockResolvedValue(null);
      const mockResponsibleDto = { responsibles: [1, 2] };
      await expect(cardService.inviteResponsible(1, mockResponsibleDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('담당자 초대 성공 시 결과 반환 및 알림 전송 확인', async () => {
      const mockCard = {
        id: 1,
        title: 'original title',
        description: 'original description',
        color: 'red',
        order: 1,
        dueDate: new Date(),
        userId: 1,
      } as CardEntity;

      const mockResponsibleDto = { responsibles: [1, 2] };

      jest.spyOn(cardRepository, 'findOne').mockResolvedValue(mockCard);
      jest.spyOn(responsibleRepository, 'save').mockResolvedValue(null);
      jest.spyOn(notificationService, 'sendNotification').mockResolvedValue('notification-id');

      const result = await cardService.inviteResponsible(1, mockResponsibleDto);

      expect(responsibleRepository.save).toHaveBeenCalledTimes(
        mockResponsibleDto.responsibles.length,
      );
      mockResponsibleDto.responsibles.forEach((responsible) => {
        expect(responsibleRepository.save).toHaveBeenCalledWith({
          card: { id: 1 },
          userId: responsible,
        });
      });

      expect(notificationService.sendNotification).toHaveBeenCalledTimes(
        mockResponsibleDto.responsibles.length,
      );
      mockResponsibleDto.responsibles.forEach((responsible) => {
        expect(notificationService.sendNotification).toHaveBeenCalledWith(
          responsible,
          `${responsible}님 초대메세지가 도착했습니다.`,
        );
      });
      expect(result).toEqual({
        message: '초대가 완료되었습니다.',
        responsible: mockResponsibleDto.responsibles,
      });
    });
  });

  describe('remove Responsible', () => {
    it('해당 카드가 존재 하지 않으면 NotFoundException 반환', async () => {
      jest.spyOn(cardRepository, 'findOne').mockResolvedValue(null);
      await expect(cardService.removeResponsible(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('해당 담당자가 존재 하지 않으면 NotFoundException 반환', async () => {
      const mockCard = {
        id: 1,
        title: 'original title',
        description: 'original description',
        color: 'red',
        order: 1,
        dueDate: new Date(),
        userId: 1,
      };

      jest.spyOn(cardRepository, 'findOne').mockResolvedValue(mockCard as CardEntity);
      jest.spyOn(responsibleRepository, 'findOne').mockResolvedValue(null);

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
        userId: 1,
      };

      const mockResponsible = { id: 1, userId: 1, card: mockCard };
      jest.spyOn(cardRepository, 'findOne').mockResolvedValue(mockCard as CardEntity);
      jest
        .spyOn(responsibleRepository, 'findOne')
        .mockResolvedValue(mockResponsible as ResponsibleEntity);

      jest.spyOn(responsibleRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

      const result = await cardService.removeResponsible(1, 1);

      expect(responsibleRepository.delete).toHaveBeenCalledWith({
        id: mockResponsible.id,
      });

      expect(result).toEqual({
        message: '담당자가 삭제되었습니다.',
      });
    });
  });
  describe('moveCard', () => {
    it('첫 번째 위치로 이동하는 경우 newOrder 값이 첫 번째 카드의 절반으로 설정', async () => {
      const moveCardDto = { listId: 1, order: 1 };
      const mockCard = { id: 1, order: 5 };
      const mockCards = [{ id: 2, order: 10 }];

      jest.spyOn(cardRepository, 'findOne').mockResolvedValue(mockCard as CardEntity);
      jest.spyOn(cardRepository, 'find').mockResolvedValue(mockCards as CardEntity[]);
      jest.spyOn(cardRepository, 'save').mockResolvedValueOnce(mockCard as CardEntity);

      await cardService.moveCard(mockCard.id, moveCardDto);

      expect(mockCard.order).toBe(mockCards[0].order / 2);
      expect(cardRepository.save).toHaveBeenCalledWith(mockCard);
    });

    it('마지막 위치로 이동하는 경우 newOrder 값이 마지막 카드의 order + 1', async () => {
      const moveCardDto = { listId: 1, order: 6 };
      const mockCard = { id: 1, order: 5 };
      const mockCards = [
        { id: 2, order: 1 },
        { id: 3, order: 2 },
        { id: 4, order: 3 },
        { id: 5, order: 4 },
        { id: 6, order: 5 },
      ];

      jest.spyOn(cardRepository, 'findOne').mockResolvedValue(mockCard as CardEntity);
      jest.spyOn(cardRepository, 'find').mockResolvedValue(mockCards as CardEntity[]);
      jest.spyOn(cardRepository, 'save').mockResolvedValueOnce(mockCard as CardEntity);

      await cardService.moveCard(mockCard.id, moveCardDto);

      expect(mockCard.order).toBe(mockCards[mockCards.length - 1].order + 1);
      expect(cardRepository.save).toHaveBeenCalledWith(mockCard);
    });

    it('중간 위치로 이동하는 경우 newOrder 가 targetOrder 와 preTargetOrder 의 중간 값', async () => {
      const moveCardDto = { listId: 1, order: 3 };
      const mockCard = { id: 1, order: 5 };
      const mockCards = [
        { id: 2, order: 1 },
        { id: 3, order: 2 },
        { id: 4, order: 4 },
        { id: 5, order: 6 },
      ];

      jest.spyOn(cardRepository, 'findOne').mockResolvedValue(mockCard as CardEntity);
      jest.spyOn(cardRepository, 'find').mockResolvedValue(mockCards as CardEntity[]);
      jest.spyOn(cardRepository, 'save').mockResolvedValueOnce(mockCard as CardEntity);

      await cardService.moveCard(mockCard.id, moveCardDto);

      const expectedOrder =
        (mockCards[moveCardDto.order - 1].order + mockCards[moveCardDto.order - 2].order) / 2;
      expect(mockCard.order).toBe(expectedOrder);
      expect(cardRepository.save).toHaveBeenCalledWith(mockCard);
    });
  });
});
