import { Test, TestingModule } from '@nestjs/testing';
import { MemberGuard } from 'src/guard/members.guard';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

describe('ItemController', () => {
  let itemController: ItemController;
  let itemService: ItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        {
          provide: ItemService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(MemberGuard)
      .useValue({})
      .compile();

    itemController = module.get<ItemController>(ItemController);
    itemService = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(itemController).toBeDefined();
  });

  describe('create', () => {
    it('체크리스트 아이템 생성 성공 검증', async () => {
      const createItemDto: CreateItemDto = {
        checklistId: 1,
        content: '오늘 할일',
      };
      const result = { id: 1, ...createItemDto };

      (itemService.create as jest.Mock).mockResolvedValue(result);

      const response = await itemController.create(createItemDto);

      expect(response).toEqual(result);
      expect(itemService.create).toHaveBeenCalledWith(createItemDto);
    });
  });

  describe('update', () => {
    it('체크리스트 아이템 수정 성공 검증', async () => {
      const itemId = '1';
      const updateItemDto: UpdateItemDto = {
        status: true,
      };
      const result = { id: +itemId, ...updateItemDto };

      (itemService.update as jest.Mock).mockResolvedValue(result);

      const response = await itemController.update(itemId, updateItemDto);

      expect(response).toEqual(result);
      expect(itemService.update).toHaveBeenCalledWith(+itemId, updateItemDto);
    });
  });

  describe('remove', () => {
    it('체크리스트 아이템 삭제 성공 검증', async () => {
      const itemId = '1';
      const result = { id: +itemId, deleted: true };

      (itemService.remove as jest.Mock).mockResolvedValue(result);

      const response = await itemController.remove(itemId);

      expect(response).toEqual(result);
      expect(itemService.remove).toHaveBeenCalledWith(+itemId);
    });
  });
});
