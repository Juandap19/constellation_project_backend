import { Users } from "src/auth/entities/user.entity";
import { Criteria } from "src/criteria/entities/criteria.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CriteriaGrade {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    grade: number;

    @Column()
    student: string;  

    @Column()
    studentEval: string;

    @ManyToOne(() => Criteria, (criteria) => criteria.criteriaGrades)
    @JoinColumn({ name: 'criteria_id' })
    criteria: Criteria;
}
