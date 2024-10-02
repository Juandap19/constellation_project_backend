import { Column, Entity, ManyToOne, PrimaryGeneratedColumn  } from "typeorm";

@Entity()
export class Teacher {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    last_name: string

    @Column()
    email: string

    @Column()
    password: string


    
}
