import { number } from 'joi';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity({ name: 'workspace' })
export class WorkspaceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, name: 'workspaceName' })
  workspaceName: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true, name: 'createdAt' })
  createdAt: Timestamp;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column('simple-array')
  members: string[];

  // @ManyToOne(() => User, user => user.workspaces) //TODO:User and workspace 관계설정
  // @JoinColumn({ name: 'userId' })
  // user: User;
}
