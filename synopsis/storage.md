# Storage
Data is stored in a SQL-database (with [Mikro-ORM](https://mikro-orm.io/))
The following tables will be utilized:

- **`recs_user`**
- **`recs_refresh_token`**
- **`recs_access_token`**
- **`recs_session`**

## The `recs_user`-table
The aim of this table is to store the following atributes for a user:
- `id       +primary [uuid]`: ID assigned to the user
- `username +unique  [string]`: The preferred user-name of the user (can be changed later on) 
- `email    +unique  [string]`: The email of the user (can be changed later on)
- `user_status       [string]`: Look at the [concept](concept.md#the-user-account)
- `password_hash     [string]`: The password hashed with [bcrypt](https://github.com/dcodeIO/bcrypt.js)

## The `recs_refresh_token`-table
The aim of this table is to store the refresh-tokens explained in the [concept](concept.md#speaking-of-tokens):
- `session     +primary @recs_session`: The session to which the token belongs to.
- `token       +unique  [string]  `: The refresh-token itself.
- `user        +unqiue  @recs_user`: The user the token belongs to.
- `valid_until          [date]    `: The time at which the token runs stale.

## The `recs_access_token`-table
The aim of this table is to store all the access 
- `session     +primary @recs_session`: The session to which the token belongs to.token explained in the [concept](concept.md#speaking-of-tokens)
- `token       +unquie  [string]`: The access-token itself.
- `user        +unqiue  @user `: The user the token belongs to.
- `valid_unitl          [date]`: The time at which the token runs stale.

## The `recs_session`-table
The aim of this table is to store all sessions by user and ip-address.
- `session_id +primary [uuid]`: Unique id generated for the session.
- `user                @user `: The user the session belongs to.
- `ipv6                [cidr]`: The ipv6-address from which the session was initialized. Either ipv6 or ipv4 must be set.
- `ipv4                [cidr]`: The ipv4-address from which the session was initialized. Either ipv6 or ipv4 must be set.
- `valid_until         [date]`: The time at which the session expires. Must be the same time that is set in the `jwt` for the `id-token`. 