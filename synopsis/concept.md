# Concept
The structure of the DB is discussed in the [storage](storage.md).  

The idea is to strictly part the frontend from the backend-api. The backend should by secured by harder measures than the frontend. 

## The time-factor
- **`life-duration`**: This is how long it takes until the user has to re-login. It will **NOT** be possible to be logged in for every, since this is just unacceptable from a security-perspective. Adequate value would be a few days to max. 1 week.  

- **`backend-duration`**: This is how long it takes until the `access-token` expires and the `refresh-token` is required to obtain a new one. Adequate values would be 5 min to max 30 min.

## Speaking of tokens
- **`id-token`**: This is the token used to obtain web-content like the html-pages (NOT DATA). Has the length of the `life-duration`. Will be a `JWT`, since it would not be very useful to a threat-actor to just obtain html-content from the frontend without any data.

- **`refresh-token`**: This token is used to obtain `access-token`s. This token is **ONLY** send with a request after the `access-token` went stale. They will than be renewed together (so this means it is single-use). Will be a random string which must be looked up in the DB (see [storage](storage.md)).

- **`access-token`**: This token is sent with **EVERY** api-request and is used for authentication, until it runs stale (then, the `refresh-token` will be used to obtain a new one). Will be a random string which must be looked up in the DB (see [storage](storage.md)).

## Why would it be safe to also renew the `refresh-token` together with the `access-token`?
Since the `refresh-token` is kept private until renewal and both tokens are required to obtain a new valid `refresh-token` along side with a fresh `access-token`, it is not possible to get a new `refresh-token` with only a stolen `access-token`.

## The user-account
A user account can have 3 statuses:
- **`ACTIVE`**: Normal state. Everything is fine.
- **`LOCKED`**: The account is locked by and admin.
- **`UNCONFIRMED`**: The account has been created but not yet confirmed through the email.
- **`INACTIVE`**: The user has abandoned the account, can only be reactivated by an admin. The user can still delete the account.

## Step by step
## Creating an account
1. The user submits his email, user-name and password  

3. The server accepts it, hashes the password with `bcrypt` and saves it to DB (see [storage](storage.md)). The user is created, but in an `UNCONFIRMED` state.  

5. The user confirms his email. Everything is setup and running. The user can now [log in](#logging-in)

## Logging in
The user has created his account and wants to use it now.
1. The user sends either his username or his email alongside with his password to the server.  

3. The server searches for the salt of the hash by using email / username. After finding it, the password provided is hashed and compared against the password hash.  

5. When they match, the server starts the [token-exchange](#token-exchange).

## Token-exchange
The user has been authenticated and needs a token for subsequent requests. 
1. The server generates the `id-token` (`JWT`), the `access-token` and the `refresh-token`. All of them are now sent to the client.
  
3. The client receives his tokens and hides the `refresh-token`.  

4. For the time of `life-duration`, the website can be viewed. Data is accessible for the `backend-duration`, after which the first cycle in the [token-life-cycle](#token-life-cycle) starts.

## Token-life-cycle
1. The client has been notified during his request that his `access-token` has gone stale and now sends a request, containing the stale token, to obtain a fresh one using the `refresh-token`.  

3. The server receives both tokens and checks if they are valid and belong together. If not, the admin is notified and the user is logged out immediately. If it was valid, the server deletes both tokens from his storage (see [storage](storage.md)) and sends the new tokens to the client. The cycle starts again.