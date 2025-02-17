import { MikroORM } from "@mikro-orm/postgresql";
import { ErrorCode, RecsError } from "./lib/error.js";

export interface RecsConfig {
    validation: {
        username_regex: RegExp,
        password_regex: RegExp
    }
}

export let CONFIG: RecsConfig = {
    validation: {
        username_regex: /\w{5,15}/,
        password_regex: /(\w|[!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@\[\\\]\^_`{\|}~]){12,}/
    }
}

export let DB: MikroORM;

let configured = false;

export function configRecs(db: MikroORM, config: RecsConfig = CONFIG) {

    if (configured) {
        throw new RecsError(ErrorCode.DUAL_CONFIG, "Config can only be called once!");
    }

    configured = true;

    CONFIG = config;
    DB = db;
}