import { UUID } from "crypto"
import { InferModelFromColumns, InferSelectModel } from "drizzle-orm"
import { pgEnum } from "drizzle-orm/pg-core"
import { recsUsers } from "../db/schema.js"

export enum UserStatus {
    ACTIVE = 'active',
    LOCKED = 'locked',
    UNCONFIRMED = 'unconfirmed',
    INACTIVE = 'inactive',
}

export const PGUserStatus = pgEnum("userStatus", Object.keys(UserStatus) as [string, ...string[]])

export interface RecsConfig {
    validation: {
        username_regex: RegExp,
        password_regex: RegExp
    }
}

export interface RecsUser {
    id: string,
    userName: string,
    email: string,
    status: string,
    passwordHash: string,
}