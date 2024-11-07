import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  BaseEntity,
  JoinTable,
} from 'typeorm';
import { MemberEntity } from 'src/member/entity/member.entity';
import { ChecklistEntity } from 'src/checklist/entities/checklist.entity';

@Entity({ name: 'workspace' })
export class WorkspaceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, name: 'workspaceName' })
  workspaceName: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true, name: 'createdAt' })
  createdAt: Date;

  @OneToMany(() => MemberEntity, (member) => member.workspace)
  members: MemberEntity[];

  // @OneToMany(() => ChecklistEntity, (checklist) => checklist.workspace)
  // checklists: ChecklistEntity[];
}
