import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

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

  @ManyToOne(() => User, (user: User) => user.members)
  user: User;
}
