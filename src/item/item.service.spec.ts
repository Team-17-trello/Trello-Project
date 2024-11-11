import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChecklistEntity } from 'src/checklist/entities/checklist.entity';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemEntity } from './entities/item.entity';
import { ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;
  let repository: Repository<ItemEntity>;

  const mockItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
  };

  const mockChecklistRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: getRepositoryToken(ItemEntity),
          useValue: mockItemRepository,
        },
        {
          provide: getRepositoryToken(ChecklistEntity),
          useValue: mockChecklistRepository,
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    repository = module.get<Repository<ItemEntity>>(getRepositoryToken(ItemEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('아이템 생성하고 반환해야 한다', async () => {
      const createItemDto: CreateItemDto = { checklistId: 1, content: 'Test content' };
      const savedItem = { id: 1, content: 'Test content', status: false };
      const mockChecklist = { id: 1 };

      const { checklistId, content } = createItemDto;

      mockChecklistRepository.findOne.mockResolvedValue(mockChecklist);
      mockItemRepository.create.mockReturnValue(savedItem);
      mockItemRepository.save.mockResolvedValue(savedItem);

      const result = await service.create(createItemDto);

      expect(mockChecklistRepository.findOne).toHaveBeenCalledWith({
        where: { id: checklistId },
      });
      expect(mockItemRepository.create).toHaveBeenCalledWith({
        content: createItemDto.content,
        status: false,
        checklist: mockChecklist,
      });
      expect(mockItemRepository.save).toHaveBeenCalledWith(savedItem);
      expect(result).toEqual(savedItem);
    });
  });

  describe('update', () => {
    it('아이템을 업데이트 하고 업데이트된 아이템과 메세지를 반환해야 합니다.', async () => {
      const updateItemDto: UpdateItemDto = { content: 'Updated content' };
      const updatedItem = { id: 1, content: 'Updated content', status: false };

      mockItemRepository.update.mockResolvedValue(undefined);
      mockItemRepository.findOne.mockResolvedValue(updatedItem);

      const result = await service.update(1, updateItemDto);

      expect(mockItemRepository.update).toHaveBeenCalledWith(1, updateItemDto);
      expect(mockItemRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({
        updatedItem,
        message: '아이템이 성공적으로 업데이트되었습니다.',
      });
    });
  });

  describe('remove', () => {
    it('아이템을 삭제하고 성공 메세지를 반환해야 한다.', async () => {
      mockItemRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(mockItemRepository.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ message: '체크 리스트 항목이 성공적으로 삭제 되었습니다.' });
    });
  });
});
