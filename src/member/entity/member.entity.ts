
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { WorkspaceEntity } from 'src/workspace/entities/workspace.entity';

@Entity({
  name: 'member',
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

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.members)
  user: UserEntity;
}


