import { validate } from "email-validator";
import { CONFIG, DB } from "./config.js";
import { ErrorCode, RecsError } from "./lib/error.js";
import * as argon from "argon2";
import { RecsUser, UserStatus } from "./lib/def.js";
import { recsUsers } from "./db/schema.js";

export async function createRecsUser(userName: string, password: string, email: string): Promise<RecsUser> {
    if (!CONFIG.validation.username_regex.test(userName)) {
        throw new RecsError(ErrorCode.INVALID_USERNAME, `Username does not match ${CONFIG.validation.username_regex}!`);
    }

    if (!CONFIG.validation.password_regex.test(password)) {
        throw new RecsError(ErrorCode.INVALID_PASSWORD,  "The password did not meet given requirements!");
    }

    if (!validate(email)) {
        throw new RecsError(ErrorCode.INVALID_EMAIL, "The email provided is not valid!")
    }

    const hash: string = await argon.hash(password);

    const [ result ] = await (DB as any).insert(recsUsers).values({
        userName: userName,
        email: email,
        passwordHash: hash,
        status: UserStatus.UNCONFIRMED
    }).returning({ id: recsUsers.id, userName: recsUsers.userName, email: recsUsers.email, passwordHash: recsUsers.passwordHash, status: recsUsers.status });

    return result as RecsUser;
}