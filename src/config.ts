import { ErrorCode, RecsError } from "./lib/error.js";
import { RecsConfig } from "./lib/def.js";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export let CONFIG: RecsConfig = {
    validation: {
        username_regex: /\w{5,15}/,
        password_regex: /(\w|[!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@\[\\\]\^_`{\|}~]){12,}/
    }
}

export let DB: NodePgDatabase;

let configured = false;

export function configRecs(db: NodePgDatabase, config: RecsConfig = CONFIG) {
    if (configured) {
        throw new RecsError(ErrorCode.DUAL_CONFIG, "Config can only be called once!");
    }

    configured = true;

    CONFIG = config;
    DB = db;
}