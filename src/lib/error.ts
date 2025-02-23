export type RecsErrorCode =
    "INVALID_USERNAME" |
    "INVALID_PASSWORD" |
    "INVALID_EMAIL"    |
    "USER_EXISTS"      |
    "DUAL_CONFIG"      |
    "INVALID_CONFIG";

export class RecsError extends Error {
    public code: RecsErrorCode;

    constructor(code: RecsErrorCode, msg: string) {
        super(msg);

        this.code = code;
    }
}