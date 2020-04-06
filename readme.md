# Documentation 

the vidly application requires a vidly_jwtPrivateKey environemnt config variable. run:

```sh
$ export vidly_jwtPrivateKey=1234
```

the Vidlyapp is protected, you must have a valid jsonwebtoken to perform post/put/delete requests
to get a users jsonwebtoken, use the user/me endpoint. use the following details to get either an admin or non admin user:

| Key | Value |
| ------ | ------ |
| email | johnsmith@gmail.com |
| password | Password1234 |
| isAdmin | false |
| jsonwebtoken | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGI0MTk2OGNhNzc2OTE3NzhhNGIxZTMiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTcyMTAyOTU4fQ.lg69Btu39DtzhNS7QGN-iwqjBtLFuPHqUPfJCqJpXZ8 |

| Key | Value |
| ------ | ------ |
| email | joe@gmail.com |
| password | Password1234 |
| isAdmin | true |
| jsonwebtoken | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGI0NWRkMmU2ODE0MTFmMWFlN2Q2ZjciLCJpYXQiOjE1NzIxMDE1ODZ9.Az1SaxD3UGpYRvbZ7SfwQf7UwOl53VY1D-sDjUCy1fE |

add the jsonwebtoken as an x-auth-token header key, to make user or admin requests.

use https://jwt.io/ to test valid json web tokens


# TODO

  - customers can rent a mobie mutple times but only return once...
  - refactor validater function across route handlers
  - setup tests for other routes
  - winston-mongodb not activee (logging.js)

