import { RecsErrorCode, RecsError } from "./lib/error.js";
import { RecsConfig } from "./lib/def.js";
import { PgDatabase } from "drizzle-orm/pg-core";

export let RECS_CONFIG: RecsConfig = {
    validation: {
        username_regex: /\w{5,15}/,
        password_regex: /(\w|[!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@\[\\\]\^_`{\|}~]){12,}/
    }
}

export let DB: PgDatabase<any>;

let configured = false;

export function configRecs(db: PgDatabase<any>, config: RecsConfig = RECS_CONFIG) {
    if (configured) {
        throw new RecsError("DUAL_CONFIG", "Config can only be called once!");
    }

    configured = true;

    RECS_CONFIG = config;
    DB = db;
}