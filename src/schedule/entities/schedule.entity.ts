import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Users } from 'src/auth/entities/user.entity';

@Entity()
export class Schedule {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column("text" ,{unique: true})
    day: string

    @Column("time", {unique: true})
    hour_i: string;

    @Column("time", {unique: true})
    hour_f: string;
  
    @Column( {unique: true})
    state: boolean;

    @ManyToOne(() => Users, (user) => user.schedules)
    @JoinColumn()
    user: Users;
}
