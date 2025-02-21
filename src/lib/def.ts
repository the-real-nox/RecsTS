export enum UserStatus {
    ACTIVE = 'active',
    LOCKED = 'locked',
    UNCONFIRMED = 'unconfirmed',
    INACTIVE = 'inactive',
}


export interface RecsConfig {
    validation: {
        username_regex: RegExp,
        password_regex: RegExp
    }
}

export interface RecsUser {
    id: string,
    userName: string,
    email: string,
    status: string,
    passwordHash: string,
}