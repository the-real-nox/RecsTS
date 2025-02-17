import { Collection, Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { v4 } from "uuid";
import { UserStatus } from "../lib/def.js";

@Entity()
export class RecsUser {

    @PrimaryKey({ type: "uuid" })
    id = v4();

    @Property({ nullable: false })
    @Unique()
    username!: string;

    @Property({ nullable: false })
    @Unique()
    email!: string;

    @Property({ nullable: false })
    @Enum(() => UserStatus)
    user_status!: UserStatus;

    @Property({ nullable: false })
    password_hash!: string;

    @OneToMany(() => RecsSession, (session) => session.user)
    session = new Collection<RecsSession>(this);
}

@Entity()
export class RecsSession {
    @PrimaryKey({ type: 'uuid' })
    session_id = v4();

    @Property({ nullable: false, unique: true })
    refresh_token!: string;
    
    @Property({ nullable: false, unique: true })
    access_token!: string;
    
    @Property({ nullable: false })
    access_token_created!: Date;

    @Property({ nullable: false })
    ip!: string;

    @Property({ nullable: false })
    created_at!: Date;

    @ManyToOne(() => RecsUser, { nullable: false })
    user!: RecsUser;
}

export default [ RecsSession, RecsUser ];