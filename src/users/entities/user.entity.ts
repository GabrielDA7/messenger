import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import * as bcrypt from 'bcryptjs';
import {Exclude, Expose} from "class-transformer";

@Exclude()
@Entity('users')
export class User  {
    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }

    @Expose()
    @PrimaryGeneratedColumn()
    id: number;

    @Expose()
    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Expose()
    @Column({default: false})
    isConnected: boolean;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(attempt: string): Promise<boolean> {
        return await bcrypt.compare(attempt, this.password);
    }
}
