import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { assignToken } from '@nestjs/core/middleware/utils';
import { CommentDto } from './dto/comment.dto';
import { UserEntity } from '../user/entities/user.entity';
import { CommentEntity } from './entities/comment.entity';

describe('CommentController', () => {
  let commentController: CommentController
  let commentService: jest.Mocked<CommentService>

  beforeEach(async () => {
    const mockCommentService = {
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: mockCommentService,
        },
      ],
    }).compile();

    commentController = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService) as jest.Mocked<CommentService>

  });

  it('should be defined', () => {
    expect(commentController).toBeDefined();
  });

  describe('create', () => {
    it('댓글 생성 메서드를 호출하고 결과를 반환', async () => {
      const mockCommentDto: CommentDto = { text: 'Test comment' };
      const mockUser: UserEntity = { id: 1 } as UserEntity;
      const mockCardId = '1';

      const mockResult = {
        statusCode: 201,
        comment: { id: 1, text: 'Test comment', userId: 1 },
      };
      commentService.create.mockResolvedValue(mockResult as any);
      const result = await commentController.create(mockCardId, mockUser, mockCommentDto);
      expect(commentService.create).toHaveBeenCalledWith(1, mockUser, mockCommentDto);
      expect(result).toEqual(mockResult);

    })
  })

  describe('update', () => {
    it('댓글 수정 메소드를 호출하고 결과를 반환', async () => {
      const mockCommentDto: CommentDto = { text: 'Updated comment' };
      const mockUser: UserEntity = { id: 1 } as UserEntity;
      const mockCommentId = '1';
      const mockResult = {
        statusCode: 200,
        comment: { id: 1, text: 'Updated comment', userId: 1 },
      };

      commentService.update.mockResolvedValue(mockResult as any);
      const result = await commentController.update(mockCommentId, mockUser, mockCommentDto);
      expect(commentService.update).toHaveBeenCalledWith(1, mockUser, mockCommentDto);
      expect(result).toEqual(mockResult);
    });

    describe('remove', () => {
      it('카드 제거 메소드를 호출하고 결과를 반환', async () => {
        const mockUser: UserEntity = { id: 1 } as UserEntity;
        const mockCommentId = '1';

        const mockResult = {
          statusCode: 200,
        };

        commentService.remove.mockResolvedValue(mockResult as any);
        const result = await commentController.remove(mockCommentId, mockUser);
        expect(commentService.remove).toHaveBeenCalledWith(1, mockUser);
        expect(result).toEqual(mockResult);
      });
    });
  })

})