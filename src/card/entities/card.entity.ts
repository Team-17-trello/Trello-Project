import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Responsible } from './responsible.entity';

@Entity({
  name: 'cards',
})
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  color: string;

  @Column({ type: 'int', nullable: false })
  order: number;

  @CreateDateColumn({ type: 'timestamp', nullable: false, name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false, name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'due_date', default: null })
  dueDate: Date;

  @ManyToOne(() => List, (list) => list.card)
  list: List;

  @OneToMany(() => Responsible, (responsible) => responsible.card)
  responsible: Responsible[];

  @Column({ type: 'number', nullable: false })
  author: number;

}
