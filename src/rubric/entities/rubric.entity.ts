import { Criteria } from "src/criteria/entities/criteria.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Activity } from "src/activity/entities/activity.entity";

@Entity()
export class Rubric {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @OneToMany(() => Criteria, (criteria) => criteria.rubric, { cascade: true })
    criterias: Criteria[]; 

    @OneToOne(() => Activity, (activity) => activity.rubric)
    @JoinColumn({ name: 'activity_id' })
    activity: Activity;
}
