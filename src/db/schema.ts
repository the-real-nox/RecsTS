import { char, cidr, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { v4 } from "uuid";
import { UserStatus } from "../lib/def.js";
import { randomBytes } from "crypto";

export const PGUserStatus = pgEnum("userStatus", Object.values(UserStatus) as [string, ...string[]])//Object.keys(UserStatus) as [string, ...string[]])

export const recsUsers = pgTable('recs_user', {
    id: uuid().primaryKey().$defaultFn(() => v4()),
    userName: text().notNull().unique(),
    email: text().notNull(),
    status: PGUserStatus('status').notNull(),
    passwordHash: text().notNull(),
})

export const recsSessions = pgTable('recs_session', {
    id: uuid().primaryKey(),
    refreshToken: text().notNull().unique(),
    accessToken: text().notNull().unique(),
    accessTokenCreated: timestamp().notNull().defaultNow(),
    ip: cidr().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    userId: uuid().notNull()
});

export const recsUserConfirmation = pgTable('recs_user_confirmation', {
    userId:  uuid().primaryKey().references(() => recsUsers.id),
    confirmationToken: char({ length: 128 }).notNull().unique().$defaultFn(() => randomBytes(128).toString("base64url").slice(0, 128)),
    createdAt:timestamp().notNull().defaultNow()
})

export const recsUsersRelations = relations(recsUsers, ({ many, one }) => ({
    sessions: many(recsSessions),
    confirmation: one(recsUserConfirmation)
}));

export const recsSessionsRelations = relations(recsSessions, ({ one }) => ({
    user: one(recsUsers, {
        fields: [ recsSessions.userId ],
        references: [ recsUsers.id ]
    })
}));

export default { PGUserStatus, recsSessions, recsUsers, recsSessionsRelations, recsUsersRelations };