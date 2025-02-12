import { Entity, ManyToOne, OneToOne, PrimaryKey } from "@mikro-orm/core";
import { v4 } from "uuid";
import { RecsUser } from "./recs-user.entity.js";
import { RecsAccessToken } from "./recs-access-token.entity.js";
import { RecsRefreshToken } from "./recs-refresh-token.entity.js";

@Entity()
export class RecsSession {
    @PrimaryKey({ type: 'uuid' })
    session_id = v4();

    @OneToOne({ nullable: false })
    access_token!: RecsAccessToken;

    @OneToOne({ nullable: false })
    refresh_token!: RecsRefreshToken;

    @ManyToOne(() => RecsUser, { nullable: false })
    user!: RecsUser;
}
