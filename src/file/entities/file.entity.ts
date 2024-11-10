import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { CardEntity } from '../../card/entities/card.entity';

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @Column()
  fileSize: number;

  @ManyToOne(() => CardEntity, (card) => card.files ,{cascade : true})
  card: CardEntity;
}
