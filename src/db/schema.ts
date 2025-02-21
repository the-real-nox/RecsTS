import { cidr, date, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { v4 } from "uuid";
import { UserStatus } from "../lib/def.js";

console.log()
export const PGUserStatus = pgEnum("userStatus", Object.keys(UserStatus) as [string, ...string[]])//Object.keys(UserStatus) as [string, ...string[]])

export const recsUsers = pgTable('recs_user', {
    id: uuid().primaryKey().$defaultFn(() => v4()),
    userName: text().notNull().unique(),
    email: text().notNull().unique(),
    status: PGUserStatus('status').notNull(),
    passwordHash: text().notNull(),
})

export const recsSessions = pgTable('recs_session', {
    id: uuid().primaryKey(),
    refreshToken: text().notNull().unique(),
    accessToken: text().notNull().unique(),
    accessTokenCreated: date().notNull(),
    ip: cidr().notNull(),
    createdAt: date().notNull(),
    userId: uuid().notNull()
});

export const recsUsersRelations = relations(recsUsers, ({ many }) => ({
    sessions: many(recsSessions)
}));

export const recsSessionsRelations = relations(recsSessions, ({ one }) => ({
    user: one(recsUsers, {
        fields: [ recsSessions.userId ],
        references: [ recsUsers.id ]
    })
}));

export default { PGUserStatus, recsSessions, recsUsers, recsSessionsRelations, recsUsersRelations };