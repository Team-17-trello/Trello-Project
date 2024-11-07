import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ResponsibleEntity } from './responsible.entity';
import { ListEntity } from '../../list/entities/list.entity';
import { ChecklistEntity } from '../../checklist/entities/checklist.entity';
import { WorkspaceEntity } from 'src/workspace/entities/workspace.entity';
import { CommentEntity } from 'src/comment/entities/comment.entity';

@Entity({
  name: 'cards',
})
export class CardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  color: string;

  @Column({ type: 'float', nullable: false })
  order: number;

  @CreateDateColumn({ type: 'timestamp', nullable: false, name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'updated_at' })
  updatedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true, name: 'due_date', default: null })
  dueDate: Date;

  @Column({ type: 'int', nullable: false })
  author: number;

  @OneToMany(() => ChecklistEntity, (checklist) => checklist.card)
  checklists: ChecklistEntity;
  userId: number;

  @ManyToOne(() => ListEntity, (list) => list.cards)
  list: ListEntity;

  @OneToMany(() => ResponsibleEntity, (responsibles) => responsibles.card)
  responsibles: ResponsibleEntity[];

  @OneToMany(() => CommentEntity, (comments) => comments.card)
  comments: CommentEntity[];

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.cards)
  workspace: WorkspaceEntity;
}
