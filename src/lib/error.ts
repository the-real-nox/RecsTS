export const enum ErrorCode {
    INVALID_USERNAME,
    INVALID_PASSWORD,
    INVALID_EMAIL,
    DUAL_CONFIG
}

export class RecsError extends Error {
    public code: ErrorCode;

    constructor(code: ErrorCode, msg: string) {
        super(msg);

        this.code = code;
    }
}