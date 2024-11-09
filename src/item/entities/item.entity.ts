import { ChecklistEntity } from 'src/checklist/entities/checklist.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
export class ItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @ManyToOne(() => ChecklistEntity, (checklist) => checklist.items, { onDelete: 'CASCADE' })
  checklist: ChecklistEntity;
}
