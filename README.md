# URL Shortener API

A RESTful API service for shortening URLs, managing links, and handling user accounts. Built with **Node.js**, **Express 5**, and **MongoDB**, featuring JWT-based authentication, role-based access control, email verification, and rate limiting.

## Features

- **User registration** with email verification
- **JWT authentication** (short-lived access token + http-only refresh token cookie)
- **Role-based access control** (`user` / `admin`)
- **Create, list, and delete** short links
- **Public redirect** with visit tracking (per-link and per-user counters)
- **Rate limiting** on every route
- **Security hardening** via Helmet, CORS, compression, and cookie parsing
- **API documentation** with Swagger UI
- **Docker** support (app + MongoDB)

## Tech Stack

| Layer        | Technology                                   |
| ------------ | -------------------------------------------- |
| Runtime      | Node.js 20+ (ESM)                            |
| Framework    | Express 5                                    |
| Database     | MongoDB + Mongoose                           |
| Auth         | JSON Web Tokens (`jsonwebtoken`), `bcrypt`   |
| Validation   | `express-validator`                          |
| Email        | `nodemailer` (Ethereal test accounts)        |
| Docs         | `swagger-jsdoc` + `swagger-ui-express`       |
| Logging      | `winston`                                    |
| Rate limiting| `express-rate-limit`                         |

## Requirements

- Node.js >= 20
- MongoDB instance (local or Docker)
- An Ethereal email account for sending verification emails (optional in dev)

## Getting Started

### 1. Clone & install

```bash
git clone <repository-url>
cd "URL Shortener"
npm install
```

### 2. Configure environment

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

See [Environment Variables](#environment-variables) for the full list.

### 3. Run the server

```bash
# development (uses nodemon)
npm start
```

The server listens on the port defined by `PORT` (default `3000`).
Swagger UI is available at `http://localhost:3000/api-docs`.

## Running with Docker

A `docker-compose.yml` is provided with the API and a MongoDB service:

```bash
cp .env.example .env
docker compose up --build
```

This starts:
- the API on `http://localhost:3000`
- MongoDB on `mongodb://localhost:27017` (data persisted in a named volume)

> The compose file overrides `MONGO_URI` to point at the `mongo` service on the Docker network, so you do not need to change it manually.

## Environment Variables

| Variable                  | Description                                          | Example                              |
| ------------------------- | ---------------------------------------------------- | ------------------------------------ |
| `PORT`                    | Port the server listens on                           | `3000`                               |
| `NODE_ENV`                | `development` / `production` / `test`                | `development`                        |
| `MONGO_URI`               | MongoDB connection string                            | `mongodb://localhost:27017/URLshortner` |
| `LOG_LEVEL`               | Winston log level                                    | `info`                               |
| `WHITELISTED_EMAIL`       | Comma-separated emails allowed to register as admin  | `admin@example.com`                  |
| `CLIENT_ORIGIN`           | Front-end base URL (used in emails & short links)    | `http://localhost:3000`              |
| `JWT_ACCESS_TOKEN`        | Secret for signing access tokens                     | `secret-key`                         |
| `ACCESS_TOKEN_EXPIRY`     | Access token lifetime                                | `10m`                                |
| `JWT_REFRESH_TOKEN`       | Secret for signing refresh tokens                    | `secret-key`                         |
| `REFRESH_TOKEN_EXPIRY`    | Refresh token lifetime                               | `7d`                                 |
| `JWT_PASSWORD_RESET_TOKEN`| Secret for password-reset tokens                     | `secret-key`                         |
| `SMPT_AUTH_USERNAME`      | Ethereal SMTP username                               | `user@ethereal.email`                |
| `SMPT_AUTH_PASS`          | Ethereal SMTP password                               | `password`                           |

## Authentication Flow

1. **Register** → `POST /api/auth/register` (a verification email is sent).
2. **Verify email** → open the link in the email → `GET /api/auth/verify-email?token=...&email=...`.
3. **Login** → `POST /api/auth/login` returns an **access token** (Bearer) and sets an **http-only refresh token cookie**.
4. **Use protected routes** → send the access token in the `Authorization: Bearer <token>` header.
5. **Refresh** → `POST /api/auth/refresh` issues a new access token using the refresh cookie.
6. **Logout** → `POST /api/auth/logout` clears the stored refresh token.

## API Endpoints

> Interactive documentation (with request/response schemas and "Try it out") is served at **`/api-docs`**.

| Method | Path                       | Auth            | Description                          |
| ------ | -------------------------- | --------------- | ------------------------------------ |
| GET    | `/api`                     | Public          | Health check                         |
| POST   | `/api/auth/register`       | Public (limited)| Register a new user                  |
| GET    | `/api/auth/verify-email`   | Public (limited)| Verify email via `token` + `email`   |
| POST   | `/api/auth/login`          | Public (limited)| Log in, receive tokens               |
| POST   | `/api/auth/logout`         | Authenticated   | Log out                              |
| POST   | `/api/auth/refresh`        | Authenticated   | Refresh access token                 |
| GET    | `/api/user/me`             | user, admin     | Current user profile                 |
| GET    | `/api/user/get-all`        | admin           | List all users (paginated)           |
| PATCH  | `/api/user/update`         | user, admin     | Update own profile                   |
| DELETE | `/api/user/delete/:id`     | admin           | Delete a user                        |
| GET    | `/api/user/get-user/:id`   | user, admin     | Get user by id                       |
| GET    | `/api/user/get-email/:email`| admin          | Get user by email                    |
| GET    | `/api/link/my-link`        | user, admin     | List own links                       |
| POST   | `/api/link/generate`       | user, admin     | Create a short link                  |
| DELETE | `/api/link/delete/:id`     | user, admin     | Delete own link                      |
| GET    | `/api/redirect/:backHalf`  | user, admin     | Redirect to destination URL          |

### Example: create a short link

```bash
curl -X POST http://localhost:3000/api/link/generate \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Blog",
    "destination": "https://blog.example.com/post-1"
  }'
```

Response:

```json
{
  "link": {
    "title": "My Blog",
    "destination": "https://blog.example.com/post-1",
    "backHalf": "aB3xZ9",
    "shortLink": "http://localhost:3000/aB3xZ9",
    "totalVisitCount": 0,
    "creator": "665f1c2e9d3c4a0012ab34cd",
    "_id": "665f1c2e9d3c4a0012ab34ce",
    "createdAt": "2026-07-14T08:00:00.000Z",
    "updatedAt": "2026-07-14T09:00:00.000Z"
  }
}
```

## Project Structure

```
src/
├── config/            # App config (.env), DB connection, Swagger spec
├── controllers/       # Request handlers (auth, user, link, redirect)
├── errors/            # Custom error classes (BadRequest, NotFound, ...)
├── middlewares/       # authenticate, authorizePermissions, errorHandler, ...
├── models/            # Mongoose schemas (User, Link)
├── routes/            # Express routers + Swagger annotations
├── utils/             # jwt, rateLimiter, logger, email, generateBackHalf
├── validators/        # express-validator chains
├── index.js           # Express app (middlewares, routes, /api-docs)
└── server.js          # Entry point (DB connect, listen, shutdown)
```

## Scripts

| Script        | Description                          |
| ------------- | ------------------------------------ |
| `npm start`   | Start the server with nodemon       |

## Notes & Known Limitations

- The **redirect route currently requires authentication**. For a fully public URL shortener you may want to remove the `authenticate` / `authorizePermissions` middleware from `src/routes/redirect.js`.
- `verify-email` expects a `token` query parameter, matching the link built in `sendVerificationEmail.js`.
- Email sending uses a fresh Ethereal test account per send in `sendEmail.js`; swap in your real transporter for production.
- `CLIENT_ORIGIN` and the CORS whitelist in `src/config/index.js` must match your front-end origin.
