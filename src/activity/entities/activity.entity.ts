import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Rubric } from '../../rubric/entities/rubric.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  name: string;

  @OneToOne(() => Rubric, rubric => rubric.activity)
  rubric: Rubric;
}
