import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import {Card} from './card.entity';

@Entity({
  name: 'responsibles'
})
export class Responsible {

  @PrimaryGeneratedColumn()
  id:number


  @CreateDateColumn({type:'timestamp', nullable:false, name: 'created_at'})
  createdAt: Date

  @Column({type:'number',nullable:false, name: 'user_id'})
  userId: number

  @ManyToOne(()=> Card, (card)=> card.responsible)
  card:Card

}