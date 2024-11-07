import { CardEntity } from 'src/card/entities/card.entity';
import { WorkspaceEntity } from 'src/workspace/entities/workspace.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'checklists',
})
export class ChecklistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  checklistName: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @ManyToOne(() => CardEntity, (card) => card.checklist)
  card: CardEntity;

//   @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.checklist)
//   workspace: WorkspaceEntity;
}
