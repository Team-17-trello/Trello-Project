import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { WorkspaceEntity } from 'src/workspace/entities/workspace.entity';

@Entity({
  name: 'member',
})
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', nullable: false, name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'boolean', nullable: false, name: 'is_admin' })
  isAdmin: boolean;

  @ManyToOne(() => User, (user) => user.members)
  user: User;

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.members)
  workspace: WorkspaceEntity;
}
