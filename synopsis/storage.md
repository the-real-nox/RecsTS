# Storage
Data is stored in a SQL-database (with [Mikro-ORM](https://mikro-orm.io/))
The following tables will be utilized:

- **`user`**
- **`refresh_token`**
- **`access_token`**

## The `user`-table
The aim of this table is to store the following atributes for a user:
- `id       +primary [uuid]`: ID assigned to the user
- `username +unique  [string]`: The preferred user-name of the user (can be changed later on) 
- `email    +unique  [string]`: The email of the user (can be changed later on)
- `account_status    [string]`: Look at the [concept](concept.md#the-user-account)
- `password_hash     [string]`: The password hashed with [bcrypt](https://github.com/dcodeIO/bcrypt.js)

## The `refresh_token`-table
The aim of this table is to store the refresh-tokens explained in the [concept](concept.md#speaking-of-tokens):
- `user        +unique @user`: The user the tokens belongs to.
- `token       +unique [string]`: The refresh-token itself.
- `valid_until         [date]`: The time at which the token runs stale.