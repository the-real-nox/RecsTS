# Storage
Data is stored in a SQL-database (with [Mikro-ORM](https://mikro-orm.io/))
The following tables will be utilized:

- **`user`**
- **`refresh_token`**
- **`access_token`**
- **`session`**

## The `user`-table
The aim of this table is to store the following atributes for a user:
- `id       +primary [uuid]`: ID assigned to the user
- `username +unique  [string]`: The preferred user-name of the user (can be changed later on) 
- `email    +unique  [string]`: The email of the user (can be changed later on)
- `account_status    [string]`: Look at the [concept](concept.md#the-user-account)
- `password_hash     [string]`: The password hashed with [bcrypt](https://github.com/dcodeIO/bcrypt.js)

## The `refresh_token`-table
The aim of this table is to store the refresh-tokens explained in the [concept](concept.md#speaking-of-tokens):
- `user        +unique @user`: The user the token belongs to.
- `token       +unique [string]`: The refresh-token itself.
- `valid_until         [date]`: The time at which the token runs stale.

## The `access_token`-table
The aim of this table is to store all the access token explained in the [concept](concept.md#speaking-of-tokens)
- `user +unique @user`: The user the token belongs to.
- `token +unique [string]`: The access-token itself.
- `valid_unitl [date]`: The time at which the token runs stale.

## The `session`-table
The aim of this table is to store all sessions by user and ip-address.
- `session_id +primary [uuid]`: Unique id generated for the session.
- `user                @user `: The user the session belongs to.
- `ipv6                [cidr]`: The ipv6-address from which the session was initialized. Either ipv6 or ipv4 must be set.
- `ipv4                [cidr]`: The ipv4-address from which the session was initialized. Either ipv6 or ipv4 must be set.
- `valid_until         [date]`: The time at which the session expires. Must be the same time that is set in the `jwt` for the `id-token`. 