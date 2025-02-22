import { validate } from "email-validator";
import { CONFIG, DB } from "./config.js";
import { RecsErrorCode, RecsError } from "./lib/error.js";
import * as argon from "argon2";
import { RecsUser, UserStatus } from "./lib/def.js";
import { recsUsers } from "./db/schema.js";

import pg from "pg";
const { DatabaseError } = pg;

export async function createRecsUser(userName: string, password: string, email: string): Promise<RecsUser | undefined> {
    if (!CONFIG.validation.username_regex.test(userName)) {
        throw new RecsError(RecsErrorCode.INVALID_USERNAME, `Username does not match ${CONFIG.validation.username_regex}!`);
    }

    if (!CONFIG.validation.password_regex.test(password)) {
        throw new RecsError(RecsErrorCode.INVALID_PASSWORD, "The password did not meet given requirements!");
    }

    if (!validate(email)) {
        throw new RecsError(RecsErrorCode.INVALID_EMAIL, "The email provided is not valid!")
    }

    const hash: string = await argon.hash(password);


    try {
        const [result] = await DB.insert(recsUsers).values({
            userName: userName,
            email: email,
            passwordHash: hash,
            status: UserStatus.UNCONFIRMED
        }).returning({ id: recsUsers.id, userName: recsUsers.userName, email: recsUsers.email, passwordHash: recsUsers.passwordHash, status: recsUsers.status });

        return result as RecsUser;
    } catch (err: any) {
        console.log(err);
        if ("code" in err && "constraint" in err) {
            if (err.code == '23505') { // duplicate-violation
                throw new RecsError(RecsErrorCode.USER_EXISTS, "User already exists!");
            }
        }

        throw err;
    }
}