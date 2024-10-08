import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../../auth/entities/user.entity";
import { Course } from "../../courses/entities/course.entity";

@Entity()
export class Team {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToMany(() => Users , (user) => user.teams)
    users: Users[];

    @ManyToOne(() => Course, (course) => course.teams)
    course: Course;

}