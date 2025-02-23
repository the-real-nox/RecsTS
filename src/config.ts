import { RecsErrorCode, RecsError } from "./lib/error.js";
import { RecsConfig } from "./lib/def.js";
import { PgDatabase } from "drizzle-orm/pg-core";
import { SentMessageInfo, Transport, Transporter, TransportOptions } from "nodemailer";
import { Options } from "nodemailer/lib/mailer/index.js";

export let RECS_CONFIG: RecsConfig = {
    validation: {
        username_regex: /\w{5,15}/,
        password_regex: /(\w|[!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@\[\\\]\^_`{\|}~]){12,}/
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

    RECS_CONFIG = config;
    DB = db;
    MAIL_TRANSPORT = mail_transport;
}