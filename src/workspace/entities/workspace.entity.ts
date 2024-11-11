import { BoardEntity } from 'src/board/entities/board.entity';
import { CardEntity } from 'src/card/entities/card.entity';
import { MemberEntity } from 'src/member/entity/member.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'workspaces' })
export class WorkspaceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, name: 'workspaceName' })
  workspaceName: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true, name: 'createdAt' })
  createdAt: Date;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @OneToMany(() => MemberEntity, (member) => member.workspace)
  members: MemberEntity[];

  @OneToMany(() => BoardEntity, (board) => board.workspace)
  boards: BoardEntity[];

  @OneToMany(() => CardEntity, (card) => card.workspace)
  cards: CardEntity[];
}
