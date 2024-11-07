import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ListEntity } from '../../list/entities/list.entity';
import { CardEntity } from '../../card/entities/card.entity';

@Entity({
  name: 'comments',
})
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  text: string;

  @Column({ type: 'int', nullable: false, name: 'user_id' })
  userId: number;

  @CreateDateColumn({ type: 'timestamp', nullable: false, name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'updated_at' })
  updatedAt: Date | null;

  @ManyToOne(() => CardEntity, (card) => card.comments)
  card: CardEntity;
}
