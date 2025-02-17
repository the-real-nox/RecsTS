import { validate } from "email-validator";
import { CONFIG, DB } from "./config.js";
import { ErrorCode, RecsError } from "./lib/error.js";
import * as argon from "argon2";
import { RecsUser } from "./db/entities.js";
import { UserStatus } from "./lib/def.js";

export async function createRecsUser(username: string, password: string, email: string): Promise<RecsUser> {
    if (!CONFIG.validation.username_regex.test(username)) {
        throw new RecsError(ErrorCode.INVALID_USERNAME, `Username does not match ${CONFIG.validation.username_regex}!`);
    }

    if (!CONFIG.validation.password_regex.test(password)) {
        throw new RecsError(ErrorCode.INVALID_PASSWORD,  "The password did not meet given requirements!");
    }

    if (!validate(email)) {
        throw new RecsError(ErrorCode.INVALID_EMAIL, "The email provided is not valid!")
    }

    const hash: string = await argon.hash(password);

    return DB.em.create(RecsUser, {
        user_status: UserStatus.UNCONFIRMED,
        email: email,
        password_hash: hash,
        username: username,
    });
}