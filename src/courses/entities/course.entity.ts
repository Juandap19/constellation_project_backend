import { Activity } from "src/activity/entities/activity.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Users } from "src/auth/entities/user.entity";
import { ManyToMany } from "typeorm";

@Entity()
export class Course {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    name: string;
    @OneToMany(() => Activity, (activity) => activity.course, { cascade: true })
    activities: Activity[];


    @ManyToMany(() => Users, user => user.skills)
    users: Users[];
}
