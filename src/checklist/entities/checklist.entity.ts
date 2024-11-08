import { CardEntity } from 'src/card/entities/card.entity';
import { itemsEntity } from 'src/item/entities/item.entity';
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

  @ManyToOne(() => CardEntity, (card) => card.checkList, { onDelete: 'CASCADE' })
  card: CardEntity;

  @OneToMany(() => itemsEntity, (item) => item.checklist)
  items: itemsEntity[];
}
