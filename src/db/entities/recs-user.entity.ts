import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { v4 } from "uuid";
import { RecsSession } from "./recs-session.entity.js";

export enum UserStatus {
    ACTIVE,
    LOCKED,
    UNCONFIRMED,
    INACTIVE,
}

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
    account_status!: string;

    @Property({ nullable: false })
    password_hash!: string;

    @OneToMany(() => RecsSession, (session) => session.user)
    session = new Collection<RecsSession>(this);
}
