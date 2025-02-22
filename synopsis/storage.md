# Storage
Data is stored in a SQL-database (with [Mikro-ORM](https://mikro-orm.io/))
The following tables will be utilized:

- **`recs_user`**
- **`recs_session`**

## The `recs_user`-table
The aim of this table is to store the following atributes for a user:
- `id       +primary [uuid] `: ID assigned to the user
- `username +unique  [string]`: The preferred user-name of the user (can be changed later on) 
- `email             [string]`: The email of the user (can be changed later on)
- `user_status       [string]`: Look at the [concept](concept.md#the-user-account)
- `password_hash     [string]`: The password hashed with [bcrypt](https://github.com/dcodeIO/bcrypt.js)

## The `recs_session`-table
The aim of this table is to store all sessions by user and ip-address.
- `session_id           +primary [uuid]  `: Unique id generated for the session.
- `user                          @user   `: The user the session belongs to.
- `refresh_token        +unique  [string]`: The refresh token.
- `access_token         +unique  [string]`: The access token.
- `access_token_created          [date]  `: The time the access token was created. Used to refresh the token.
- `ip                            [string]`: The ip from which the session was created.
- `created_at                    [date]  `: The time at which the session whas created. 