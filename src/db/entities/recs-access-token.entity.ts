import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { RecsSession } from "./recs-session.entity.js";

@Entity()
export class RecsAccessToken {
    @PrimaryKey()
    token!: string;

    @OneToOne(() => RecsSession, (session) => session.access_token, { nullable: false })
    session!: RecsSession;
    
    @Property({ nullable: false })
    valid_until!: Date;
}