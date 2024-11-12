import { BoardEntity } from 'src/board/entities/board.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardEntity } from '../../card/entities/card.entity';

@Entity({ name: 'lists' })
export class ListEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'float' })
  order: number;

  @Column({ type: 'int' })
  userId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => BoardEntity, (board) => board.lists, { onDelete: 'CASCADE' })
  board: BoardEntity;

  @OneToMany(() => CardEntity, (card) => card.list)
  cards: CardEntity[];
}
