import { Collection, Entity, Enum, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { v4 } from "uuid";

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

    @OneToMany(() => RecsRefreshToken, (refreshToken) => refreshToken.user)
    refresh_tokens = new Collection<RecsRefreshToken>(this);

    @OneToMany(() => RecsRefreshToken, (refreshToken) => refreshToken.user)
    access_tokens = new Collection<RecsAccessToken>(this);

    @OneToMany(() => RecsSession, (session) => session.user)
}

export class RecsRefreshToken {
    @PrimaryKey()
    token!: string;

    @ManyToOne(() => RecsUser, { nullable: false })
    user!: RecsUser;
    
    @Property({ nullable: false })
    valid_until!: Date;
}

export class RecsAccessToken {
    @PrimaryKey()
    token!: string;

    @ManyToOne(() => RecsUser, { nullable: false })
    user!: RecsUser;
    
    @Property({ nullable: false })
    valid_until!: Date;
}

export class RecsSession {
    @PrimaryKey({ type: 'uuid' })
    session_id = v4();

    @OneToOne({ nullable: true })
    access_token!: RecsAccessToken;

    @OneToOne({ nullable: true })
    refresh_token!: RecsRefreshToken;
}