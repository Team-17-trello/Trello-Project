import { ListEntity } from 'src/list/entities/list.entity';
import { WorkspaceEntity } from 'src/workspace/entities/workspace.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'boards' })
export class BoardEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ nullable: true })
  backgroundColor: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  userId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.boards, { onDelete: 'CASCADE' })
  workspace: WorkspaceEntity;

  @OneToMany(() => ListEntity, (list) => list.board, { cascade: true })
  lists: ListEntity[];
}
