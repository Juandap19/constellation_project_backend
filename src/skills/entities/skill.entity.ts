import { Entity, ManyToMany, Column, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { Users } from 'src/auth/entities/user.entity';

@Entity()
export class Skills {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToMany(() => Users, user => user.skills)
    users: Users[];
}
