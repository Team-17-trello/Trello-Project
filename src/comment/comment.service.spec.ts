import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CardEntity } from '../card/entities/card.entity';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { CommentDto } from './dto/comment.dto';

describe('CommentService', () => {
  let commentService: CommentService;
  let cardRepository: Repository<CardEntity>;
  let commentRepository: Repository<CommentEntity>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(CardEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: {
            findOne: jest.fn,
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
    cardRepository = module.get<Repository<CardEntity>>(getRepositoryToken(CardEntity));
    commentRepository = module.get<Repository<CommentEntity>>(getRepositoryToken(CommentEntity));

  });

  describe('creat comment', () => {

    const mockUser: UserEntity = {
      id: 1,
      email: 'test@test.com',
      password: 'test1234',
      nickname: 'tester',
      createdAt: new Date(),
      deletedAt: null,
      members: null,
    };
    const mockCard: CardEntity = {
      id: 1,
      title: 'Test Title',
      description: 'Test Description',
      color: 'blue',
      order: 3,
      userId: 1,
      list: null,
      createdAt: new Date(),
      updatedAt: null,
      dueDate: new Date(),
      responsibles: null,
      comments: null,
    };

    const mockCommentDto: CommentDto = {
      text: 'sometext',
    };

    const mockComment: CommentEntity = {
      id: 1,
      text: mockCommentDto.text,
      userId: 1,
      createdAt: new Date(),
      updatedAt: null,
      card: null,
    };
    it('해당 카드가 없을 시 NotfoundException 반환', async () => {

      jest.spyOn(cardRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(commentService.create(1, mockUser, mockCommentDto)).rejects.toThrow(NotFoundException);

    });

    it('댓글 생성 시 생성된 댓글 반환', async () => {

      jest.spyOn(cardRepository, 'findOne').mockResolvedValue(mockCard);
      jest.spyOn(commentRepository, 'save').mockResolvedValue(mockComment);
      expect(await commentService.create(mockCard.id, mockUser, mockCommentDto)).toEqual({
        statusCode: 201,
        message: '댓글이 생성되었습니다.',
        comment: mockComment,
      });
    });

  });

  describe('update comment', () => {

    const mockComment: CommentEntity = {
      id: 1,
      text: 'testText',
      userId: 1,
      createdAt: new Date(),
      updatedAt: null,
      card: null,
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

    const wrongMockUser: UserEntity = {
      id: 2,
      email: 'test@test.com',
      password: 'test1234',
      nickname: 'tester',
      createdAt: new Date(),
      deletedAt: null,
      members: null,
    };

    const mockCommentDto: CommentDto = {
      text: 'update_text',
    };

    it('해당 댓글이 없을 시 NotFoundException 던짐', async () => {
      jest.spyOn(commentRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(commentService.update(null, mockUser, mockCommentDto)).rejects.toThrow(NotFoundException);

      expect(commentRepository.findOne).toHaveBeenCalledWith({ where: {id :null} });
      expect(commentRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('댓글 작성자 아이디와 수정 인원 아이디 불일치 시 UnAuthorizedException 던짐', async () => {


      jest.spyOn(commentRepository, 'findOne').mockResolvedValueOnce(mockComment);

      await expect(commentService.update(mockComment.id, wrongMockUser, mockCommentDto)).rejects.toThrow(UnauthorizedException);

      expect(commentRepository.findOne).toHaveBeenCalledWith({ where: {id : mockComment.id} });
      expect(commentRepository.findOne).toHaveBeenCalledTimes(1);

    });

    it('댓글이 존재하고 댓글 수정 권한이 있으면 댓글을 수정하고 status 코드 200과 업데이트한 코멘트 객체 반환', async () => {

      jest.spyOn(commentRepository, 'findOne').mockResolvedValueOnce(mockComment);

      const updatedComment = { ...mockComment, ...mockCommentDto };

      jest.spyOn(commentRepository, 'save').mockResolvedValueOnce(updatedComment);

      const result = await commentService.update(mockComment.id, mockUser, mockCommentDto);
      expect(result).toEqual({
        status: 200,
        comment: updatedComment,
      });

      expect(commentRepository.findOne).toHaveBeenCalledWith({ where: {id : mockComment.id} });
      expect(commentRepository.findOne).toHaveBeenCalledTimes(1);
      expect(commentRepository.save).toHaveBeenCalledWith(updatedComment);
      expect(commentRepository.save).toHaveBeenCalledTimes(1);


    });
  });

  describe('remove comment', () => {

    const mockUser: UserEntity = {
      id: 1,
      email: 'test@test.com',
      password: 'test1234',
      nickname: 'tester',
      createdAt: new Date(),
      deletedAt: null,
      members: null,
    };

    const mockComment: CommentEntity = {
      id: 1,
      text: 'some',
      userId: 1,
      createdAt: new Date(),
      updatedAt: null,
      card: null,
    };
    it('해당 댓글 없을 시 NotfoundException 반환', async () => {

      jest.spyOn(commentRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(commentService.remove(1, mockUser)).rejects.toThrow(NotFoundException);
    });

    it('댓글 주인 아닐 시 UnauthrizException 반환', async () => {
      jest.spyOn(commentRepository, 'findOne').mockResolvedValue({
        ...mockComment,
        userId: 2,
      });
      await expect(commentService.remove(1, mockUser)).rejects.toThrow(UnauthorizedException);
      expect(commentRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });

    });

    it('댓글 삭제 시 메세지 반환', async () => {

      jest.spyOn(commentRepository, 'findOne').mockResolvedValue(mockComment);
      jest.spyOn(commentRepository, 'delete').mockResolvedValueOnce({ affectd: 1 } as any)
      await expect(await commentService.remove(1, mockUser)).toEqual({
        statusCode: 200,
        message: '댓글이 삭제 되었습니다.',
      });


    });

  });


});
