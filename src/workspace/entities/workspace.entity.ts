import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity({ name: 'workspace' })
export class WorkspaceEntity {
  @PrimaryGeneratedColumn()
  workspaceId: number;

  @Column({ type: 'varchar', nullable: false, name: 'workspaceName' })
  workspaceName: string;

  @Column({ type: 'timestamp', nullable: false, name: 'createdAt' })
  createdAt: Timestamp;

  @Column({ type: 'int', nullable: false, name: 'userId' })
  userId: number;
}
