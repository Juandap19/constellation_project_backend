import { Activity } from "../../activity/entities/activity.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class Course {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    name: string;
    @OneToMany(() => Activity, (activity) => activity.course, { cascade: true })
    activities: Activity[];
}
