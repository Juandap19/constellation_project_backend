import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Skills } from 'src/skills/entities/skill.entity';
import { Team } from 'src/teams/entities/teams.entity';
import { Course } from 'src/courses/entities/course.entity';

@Entity()
export class Users {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {unique: true})
    email: string;

    @Column('text', {select: false})
    password: string;

    @Column('text')
    name: string;

    @Column('text')
    last_name: string;

    @Column('text', {default: 'student'})
    role: string;

    @Column('text')
    user_code: string;

    @OneToMany(() => Schedule, (schedule) => schedule.user , {cascade: true})
    schedules: Schedule[];

    @ManyToMany(() => Skills, skill => skill.users, { cascade: true })
    @JoinTable()
    skills: Skills[];

    @ManyToMany(()=> Team , (team) => team.users, {cascade: true})
    @JoinTable()
    teams: Team[];

    @ManyToMany(() => Course, (course) => course.users, {cascade: true})
    @JoinTable()
    courses: Course[];





}
