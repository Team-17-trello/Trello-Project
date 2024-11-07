import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ResponsibleEntity } from './responsible.entity';
import { ListEntity } from '../../list/entities/list.entity';
import { ChecklistEntity } from '../../checklist/entities/checklist.entity';
@Entity({
  name: 'cards',
})
export class CardEntity {
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

  @ManyToOne(() => ListEntity, (list) => list.card)
  list: ListEntity;

  @OneToMany(() => ResponsibleEntity, (responsible) => responsible.card)
  responsible: ResponsibleEntity[];

  @Column({ type: 'int', nullable: false })
  author: number;

  @OneToMany(() => ChecklistEntity, (checklist) => checklist.card)
  checklists: ChecklistEntity;
}
