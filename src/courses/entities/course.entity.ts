import { Activity } from "../../activity/entities/activity.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Users } from "../../auth/entities/user.entity";
import { ManyToMany } from "typeorm";
import { Team } from "../../teams/entities/teams.entity";

@Entity()
export class Course {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    name: string;

    @Column()
    description: string;
    
    @OneToMany(() => Activity, (activity) => activity.course, { cascade: true })
    activities: Activity[];

    @ManyToMany(() => Users, user => user.skills)
    users: Users[];

    @OneToMany(() => Team, (team) => team.course, {cascade: true})
    teams: Team[];
}
