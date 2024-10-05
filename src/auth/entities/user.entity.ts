import {Column , Entity , PrimaryGeneratedColumn} from 'typeorm';


@Entity('users')
export class User {

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

    @Column('text')
    role: string;

    @Column('text')
    user_code: string;

}
