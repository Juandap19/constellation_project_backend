import { Criteria } from "../../criteria/entities/criteria.entity";
import { Activity } from "../../activity/entities/activity.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RubricGrade } from "../../rubric_grade/entities/rubric_grade.entity";

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

    @OneToMany(() => RubricGrade, (rubricGrade) => rubricGrade.rubric)  
    rubricGrades: RubricGrade[];
}
