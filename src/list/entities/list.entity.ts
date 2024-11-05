import { timestamp } from 'rxjs';
import { BoardEntity } from 'src/board/entities/board.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'lists' })
export class ListEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  @Generated('increment')
  order: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => BoardEntity, (board) => board.lists)
  board: BoardEntity;
}
