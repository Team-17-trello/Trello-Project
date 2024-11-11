import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CardEntity } from '../../card/entities/card.entity';

@Entity({ name: 'files' })
export class FileEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar' })
  fileName: string;

  @Column({ type: 'varchar' })
  filePath: string;

  @Column({ type: 'int' })
  fileSize: number;

  @ManyToOne(() => CardEntity, (card) => card.files, { cascade: true })
  card: CardEntity;
}
