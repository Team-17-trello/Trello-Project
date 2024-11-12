import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from 'src/file/entities/file.entity';
import { Repository } from 'typeorm';
import { BoardEntity } from '../board/entities/board.entity';
import { CardEntity } from '../card/entities/card.entity';
import { ChecklistEntity } from '../checklist/entities/checklist.entity';
import { CommentEntity } from '../comment/entities/comment.entity';
import { ItemEntity } from '../item/entities/item.entity';
import { ListEntity } from '../list/entities/list.entity';
import { MemberEntity } from '../member/entity/member.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';

@Injectable()
export class MemberGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
    @InjectRepository(ListEntity)
    private readonly listRepository: Repository<ListEntity>,
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(ChecklistEntity)
    private readonly checklistRepository: Repository<ChecklistEntity>,
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // JWT 인증 수행
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const reqWorkspaceId = request.params.workspaceId || request.body.workspaceId;
    const boardId = request.params.boardId || request.body.boardId;
    const listId = request.params.listId || request.body.listId;
    const cardId = request.params.cardId || request.body.cardId;
    const commentId = request.params.commentId || request.body.commentId;
    const checklistId = request.params.checklistId || request.body.checklistId;
    const itemId = request.params.itemId || request.body.itemId;
    const fileId = request.params.fileId || request.body.fileId;

    console.log(cardId);

    if (!userId) {
      return false;
    }

    let workspaceId: number;

    if (reqWorkspaceId) {
      const workspace = await this.workspaceRepository.findOne({
        where: { id: reqWorkspaceId },
      });
      if (!workspace) throw new NotFoundException('workspace not found');
      workspaceId = workspace.id;
    }
    // 1. boardId가 있는 경우
    else if (boardId) {
      const board = await this.boardRepository.findOne({
        where: { id: boardId },
        relations: {
          workspace: true,
        },
      });
      if (!board) throw new NotFoundException('Board not found');
      workspaceId = board.workspace.id;
    }
    // 2. listId가 있는 경우
    else if (listId) {
      const list = await this.listRepository.findOne({
        where: { id: listId },
        relations: {
          board: { workspace: true },
        },
      });
      if (!list) throw new NotFoundException('List not found');
      workspaceId = list.board.workspace.id;
    }
    // 3. cardId가 있는 경우
    else if (cardId) {
      const card = await this.cardRepository.findOne({
        where: { id: cardId },
        relations: {
          list: { board: { workspace: true } },
        },
      });
      if (!card) throw new NotFoundException('Card not found');
      workspaceId = card.list.board.workspace.id;
    } else if (commentId) {
      const comment = await this.commentRepository.findOne({
        where: {
          id: commentId,
        },
        relations: { card: { list: { board: { workspace: true } } } },
      });
      if (!comment) throw new NotFoundException('comment not found');
      workspaceId = comment.card.list.board.workspace.id;
    } else if (checklistId) {
      const checklist = await this.checklistRepository.findOne({
        where: {
          id: checklistId,
        },
        relations: {
          card: {
            list: {
              board: {
                workspace: true,
              },
            },
          },
        },
      });
      if (!checklist) throw new NotFoundException('checklist not found');
      workspaceId = checklist.card.list.board.workspace.id;
    } else if (itemId) {
      const item = await this.itemRepository.findOne({
        where: {
          id: itemId,
        },
        relations: {
          checklist: {
            card: {
              list: {
                board: {
                  workspace: true,
                },
              },
            },
          },
        },
      });
      if (!item) throw new NotFoundException('item not found');
      workspaceId = item.checklist.card.list.board.workspace.id;
    } else if (fileId) {
      const file = await this.fileRepository.findOne({
        where: {
          id: fileId,
        },
        relations: { card: { workspace: true } },
      });
      if (!file) throw new NotFoundException('file not found');
      workspaceId = file.card.workspace.id;
    } else {
      return false;
    }

    console.log(workspaceId);

    // 사용자(member)가 해당 workspaceId의 멤버인지 확인
    const member = await this.memberRepository.findOne({
      where: {
        user: { id: userId },
        workspace: { id: workspaceId },
      },
    });

    // 멤버가 존재하면 true 반환, 아니면 false 반환
    return !!member;
  }
}
