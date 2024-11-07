import { WorkspaceEntity } from 'src/workspace/entities/workspace.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({
  name: 'members',
})
export class MemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', nullable: false, name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'boolean', nullable: false, name: 'is_admin' })
  isAdmin: boolean;

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.members)
  @JoinColumn()
  workspace: WorkspaceEntity;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.members, { onDelete: 'CASCADE' })
  user: UserEntity;
}
