import { Test, TestingModule } from '@nestjs/testing';
import { MemberGuard } from 'src/guard/members.guard';
import { UserEntity } from '../user/entities/user.entity';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { DueDateDto } from './dto/duedate.dto';
import { MoveCardDto } from './dto/move-card.dto';
import { ResponsibleDto } from './dto/responsible.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardEntity } from './entities/card.entity';

describe('CardController', () => {
  let cardController: CardController;
  let cardService: CardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [
        {
          provide: CardService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            setDueDate: jest.fn(),
            inviteResponsible: jest.fn(),
            removeResponsible: jest.fn(),
            remove: jest.fn(),
            moveCard: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(MemberGuard)
      .useValue({})
      .compile();

    cardController = module.get<CardController>(CardController);
    cardService = module.get<CardService>(CardService);
  });

  const mockCard: CardEntity = {
    id: 1,
    title: 'original title',
    description: 'original description',
    color: 'red',
    order: 1,
    dueDate: new Date('2024-11-06T10:49:31.641Z'),
    userId: 1,
    createdAt: new Date(),
    updatedAt: null,
    list: null,
    responsibles: null,
    comments: null,
    workspace: null,
    checklists: null,
    files: null,
  };

  const mockUser: UserEntity = {
    id: 1,
    email: 'test@test.com',
    password: 'test1234',
    nickname: 'tester',
    createdAt: new Date(),
    deletedAt: null,
    members: null,
  };

  const mockCards: CardEntity[] = [
    {
      id: 1,
      title: 'original title',
      description: 'original description',
      color: 'red',
      order: 1,
      dueDate: new Date('2024-11-06T10:49:31.641Z'),
      userId: 1,
      createdAt: new Date(),
      updatedAt: null,
      list: null,
      responsibles: null,
      comments: null,
      workspace: null,
      checklists: null,
      files: null,
    },
  ];

  describe('create', () => {
    it('cardService.create 메소드가 올바른 인자와 호출되는지 확인', async () => {
      const createCardDto: CreateCardDto = {
        listId: 1,
        title: 'test_title',
        description: 'test_description',
        color: 'test_color',
        dueDate: new Date(),
      };

      const spy = jest.spyOn(cardService, 'create').mockResolvedValue({
        card: mockCard,
      });

      await cardController.create(mockUser, createCardDto);
      expect(spy).toHaveBeenCalledWith(mockUser, createCardDto);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('cardService.findAll 메소드가 올바른 인자와 호출되는지 확인', async () => {
      const mockListId = '1';

      const spy = jest.spyOn(cardService, 'findAll').mockResolvedValue({
        cards: mockCards,
      });

      await cardController.findAll(mockListId);
      expect(spy).toHaveBeenCalledWith(+mockListId);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('cardService.findOne 메소드가 올바른 인자와 호출되는지 확인', () => {
      const mockCardId = '1';

      const spy = jest.spyOn(cardService, 'findOne').mockResolvedValue({
        card: mockCard,
      });

      cardController.findOne(mockCardId);
      expect(spy).toHaveBeenCalledWith(+mockCardId);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('cardService.update 메소드가 올바른 인자와 호출되는지 확인', () => {
      const mockCardId = '1';
      const mockUpdateCardDto: UpdateCardDto = {
        title: 'test',
        description: 'test',
        color: 'black',
      };

      const spy = jest.spyOn(cardService, 'update').mockResolvedValue({
        message: '성공적으로 카드가 수정되었습니다.',
        updated: mockCard,
      });

      cardController.update(mockCardId, mockUpdateCardDto);
      expect(spy).toHaveBeenCalledWith(+mockCardId, mockUpdateCardDto);
      expect(spy).toHaveBeenCalledWith(+mockCardId, mockUpdateCardDto);
    });
  });

  describe('remove', () => {
    it('cardService.remove 메소드가 올바른 인자와 호출되는지 확인', () => {
      const mockCardId = '1';

      const spy = jest.spyOn(cardService, 'remove').mockResolvedValue({
        message: '카드가 삭제 되었습니다.',
      });

      cardController.remove(mockCardId);
      expect(spy).toHaveBeenCalledWith(+mockCardId);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('setDueDate', () => {
    it('cardService.setDueDate 메소드가 올바른 인자와 호출되는지 확인', () => {
      const mockCardId = '1';
      const mockDueDateDto: DueDateDto = {
        dueDate: new Date(),
      };

      const spy = jest.spyOn(cardService, 'setDueDate').mockResolvedValue({
        message: `마감 기한이 설정 됐습니다. ${mockDueDateDto.dueDate}`,
        dueDate: mockDueDateDto.dueDate,
      });

      cardController.setDueDate(mockCardId, mockDueDateDto);

      expect(spy).toHaveBeenCalledWith(+mockCardId, mockDueDateDto);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('inviteResponsible', () => {
    it('cardService.inviteResponsible 메소드가 올바른 인자와 호출되는지 확인', () => {
      const mockCardId = '1';
      const mockResponsibleDto: ResponsibleDto = {
        responsibles: [1],
      };

      const spy = jest.spyOn(cardService, 'inviteResponsible').mockResolvedValue({
        message: '초대가 완료되었습니다.',
        responsible: mockResponsibleDto.responsibles,
      });

      cardController.inviteResponsible(mockCardId, mockResponsibleDto);

      expect(spy).toHaveBeenCalledWith(+mockCardId, mockResponsibleDto);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeResponsible', () => {
    it('cardService.removeResponsible 메소드가 올바른 인자와 호출되는지 확인', () => {
      const mockCardId = '1';
      const mockResponsibleId = '1';

      const spy = jest.spyOn(cardService, 'removeResponsible').mockResolvedValue({
        message: '담당자가 삭제되었습니다.',
      });

      cardController.removeResponsible(mockCardId, mockResponsibleId);

      expect(spy).toHaveBeenCalledWith(+mockCardId, +mockResponsibleId);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('moveCard', () => {
    it('cardService.moveCard 메소드가 올바른 인자와 호출되는지 확인', () => {
      const mockCardId = '1';
      const mockMoveCardDTO: MoveCardDto = {
        listId: 1,
        order: 1,
      };

      const spy = jest.spyOn(cardService, 'moveCard').mockResolvedValue({
        message: '카드 위치가 변경되었습니다.',
      });

      cardController.moveCard(mockCardId, mockMoveCardDTO);

      expect(spy).toHaveBeenCalledWith(+mockCardId, mockMoveCardDTO);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
