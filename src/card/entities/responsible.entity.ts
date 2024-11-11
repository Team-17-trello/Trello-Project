import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CardEntity } from './card.entity';

@Entity({
  name: 'responsibles',
})
export class ResponsibleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', nullable: false, name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'int', nullable: false, name: 'user_id' })
  userId: number;

  @ManyToOne(() => CardEntity, (card) => card.responsibles, { onDelete: 'CASCADE' })
  card: CardEntity;
}
