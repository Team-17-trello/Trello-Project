import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'checklists',
})
export class ChecklistEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
