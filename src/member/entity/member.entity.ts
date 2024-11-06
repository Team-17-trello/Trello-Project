import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

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

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.members)
  user: UserEntity;
}


