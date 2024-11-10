import { CardEntity } from 'src/card/entities/card.entity';
import { ItemEntity } from 'src/item/entities/item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'checklists',
})
export class ChecklistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  checklistName: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @ManyToOne(() => CardEntity, (card) => card.checklists, { onDelete: 'CASCADE' })
  card: CardEntity;

  @OneToMany(() => ItemEntity, (item) => item.checklist)
  items: ItemEntity[];
}
