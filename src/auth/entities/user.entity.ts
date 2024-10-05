import {Column , Entity , PrimaryGeneratedColumn} from 'typeorm';


@Entity()
export class Users {

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

    @Column('text', {default: 'student'})
    role: string;

    @Column('text')
    user_code: string;

}
