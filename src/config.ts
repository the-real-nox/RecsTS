import { RecsError } from "./lib/error.js";
import { RecsConfig } from "./lib/def.js";
import { PgDatabase } from "drizzle-orm/pg-core";
import { Transporter } from "nodemailer";

export let RECS_CONFIG: RecsConfig = {
    validation: {
        username_regex: /\w{5,15}/,
        password_regex: /(\w|[!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@\[\\\]\^_`{\|}~]){12,}/
    },
    mail: {
        confirmationURLTemplate: undefined,
        sender: undefined
    }
}

export let DB: PgDatabase<any>;
export let MAIL_TRANSPORT: Transporter;

let configured = false;

export function configRecs(db: PgDatabase<any>, mail_transport: Transporter, config: RecsConfig = RECS_CONFIG) {
    if (configured) {
        throw new RecsError("DUAL_CONFIG", "Config can only be called once!");
    }

    configured = true;

    if (!config.mail.confirmationURLTemplate) {
        throw new RecsError("INVALID_CONFIG", "The user-account-confirmation-url-template must be set!")
    }

    if (!config.mail.sender) {
        throw new RecsError("INVALID_CONFIG", "The sender-email for account-confirmation must be set!")
    }

    RECS_CONFIG = config;
    DB = db;
    MAIL_TRANSPORT = mail_transport;
}