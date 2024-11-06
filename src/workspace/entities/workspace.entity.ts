import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  BaseEntity,
  JoinTable,
} from 'typeorm';
import { Member } from 'src/member/entity/member.entity';

@Entity({ name: 'workspace' })
export class WorkspaceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, name: 'workspaceName' })
  workspaceName: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true, name: 'createdAt' })
  createdAt: Date;

  @OneToMany(() => Member, (member) => member.workspace)
  @JoinTable()
  members: Member[];
}
