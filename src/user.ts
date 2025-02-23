import { validate } from "email-validator";
import { RECS_CONFIG, DB, MAIL_TRANSPORT } from "./config.js";
import { RecsError } from "./lib/error.js";
import * as argon from "argon2";
import { RecsUser, UserStatus } from "./lib/def.js";
import { recsUsers, recsUserConfirmation } from "./db/schema.js";
import { SentMessageInfo } from "nodemailer";

async function startUserConfirmation(user: RecsUser) {
    const token = await DB.insert(recsUserConfirmation).values({
        userId: user.id,
    }).returning({ confirmationToken: recsUserConfirmation.confirmationToken })

    const info = await MAIL_TRANSPORT.sendMail({
        from: `"Open-toolbox NO REPLY" ${RECS_CONFIG.mail.sender}`,
        to: user.email,
        subject: "Open-toolbox account-confirmation",
        text: RECS_CONFIG.mail.confirmationURLTemplate! + token,
    })

    console.log(`Email sent: ${info.messageId}`);
}

export async function createRecsUser(userName: string, password: string, email: string): Promise<RecsUser | undefined> {
    if (!RECS_CONFIG.validation.username_regex.test(userName)) {
        throw new RecsError("INVALID_USERNAME", `Username does not match ${RECS_CONFIG.validation.username_regex}!`);
    }

    if (!RECS_CONFIG.validation.password_regex.test(password)) {
        throw new RecsError("USER_EXISTS", "The password did not meet given requirements!");
    }

    if (!validate(email)) {
        throw new RecsError("USER_EXISTS", "The email provided is not valid!")
    }

    const hash: string = await argon.hash(password);

    let result: RecsUser | undefined;

    try {
        [ result ] = await DB.insert(recsUsers).values({
            userName: userName,
            email: email,
            passwordHash: hash,
            status: UserStatus.UNCONFIRMED
        }).returning({ id: recsUsers.id, userName: recsUsers.userName, email: recsUsers.email, passwordHash: recsUsers.passwordHash, status: recsUsers.status });
    } catch (err: any) {
        if ("code" in err && "constraint" in err) {
            if (err.code == '23505') { // duplicate-violation
                throw new RecsError("USER_EXISTS", "User already exists!");
            }
        }

        throw err;
    }

    startUserConfirmation(result);

    return result;
}