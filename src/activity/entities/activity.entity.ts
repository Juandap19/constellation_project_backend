import { Course } from 'src/courses/entities/course.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  name: string;

  @ManyToOne(() => Course, (course) => course.activities)
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
