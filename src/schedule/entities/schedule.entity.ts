import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Users } from '../../auth/entities/user.entity';

@Entity()
export class Schedule {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column("text")
    day: string

    @Column("time",)
    hour_i: string;

    @Column("time",)
    hour_f: string;
  
    @Column()
    state: boolean;

    @ManyToOne(() => Users, (user) => user.schedules)
    @JoinColumn()
    user: Users;
}
