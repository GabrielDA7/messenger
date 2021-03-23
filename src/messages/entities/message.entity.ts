import {BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/entities/user.entity";
import {Type} from "class-transformer";

@Entity('messages')
export class Message {
    constructor(partial: Partial<Message>) {
        Object.assign(this, partial);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    type: string;

    @Column({default: false})
    deleted: boolean;

    @Column({default: false})
    archived: boolean;

    @Column({default: false})
    readed: boolean;

    @Column({ type: 'date' })
    createdAt: Date;

    @Type(() => User)
    @ManyToOne(() => User)
    sender: User;

    @Type(() => User)
    @ManyToOne(() => User)
    recipient: User;

    @Type(() => Message)
    @OneToMany(() => Message, message => message.parentMessage)
    answers: Message;

    @Type(() => Message)
    @ManyToOne(() => Message)
    parentMessage: Message;

    @BeforeInsert()
    async generateDate() {
        this.createdAt = new Date();
    }
}
