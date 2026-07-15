# URL Shortener API

A simple RESTful API service for shortening URLs, managing links, and handling user accounts. Built with **Node.js**, **Express**, and **MongoDB**, featuring JWT-based authentication, role-based access control, email verification, and rate limiting.

## Features

- **User registration** with email verification
- **JWT authentication** (short-lived access token + http-only refresh token cookie)
- **Role-based access control** (`user` / `admin`)
- **Create, list, and delete** short links
- **Public redirect** with visit tracking (per-link and per-user counters)
- **Rate limiting** on every route
- **API documentation** with Swagger UI
- **Docker** support (app + MongoDB)

## Tech Stack

| Layer         | Technology                             |
| ------------- | -------------------------------------- |
| Runtime       | Node.js 20+ (ESM)                      |
| Framework     | Express 5                              |
| Database      | MongoDB + Mongoose                     |
| Auth          | JSON Web Tokens , `bcrypt`             |
| Validation    | `express-validator`                    |
| Email         | `nodemailer` (Ethereal test accounts)  |
| Docs          | `swagger-jsdoc` + `swagger-ui-express` |
| Logging       | `winston`                              |
| Rate limiting | `express-rate-limit`                   |

## Getting Started

| Script      | Description                   |
| ----------- | ----------------------------- |
| `npm start` | Start the server with nodemon |

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

```bash
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/URLshortner
LOG_LEVEL=info
WHITELISTED_EMAIL=admin@example.com
CLIENT_ORIGIN=http://localhost:3000
JWT_ACCESS_TOKEN=secret-key
ACCESS_TOKEN_EXPIRY=10m
JWT_REFRESH_TOKEN=secret-key
REFRESH_TOKEN_EXPIRY=7d
JWT_PASSWORD_RESET_TOKEN=secret-key
SMPT_AUTH_USERNAME=user@ethereal.email
SMPT_AUTH_PASS=password
```

## API Endpoints

> Interactive documentation (with request/response schemas and "Try it out") is served at **`/api-docs`**.

| Method | Path                         | Auth             | Description                        |
| ------ | ---------------------------- | ---------------- | ---------------------------------- |
| GET    | `/api`                       | Public           | Health check                       |
| POST   | `/api/auth/register`         | Public (limited) | Register a new user                |
| GET    | `/api/auth/verify-email`     | Public (limited) | Verify email via `token` + `email` |
| POST   | `/api/auth/login`            | Public (limited) | Log in, receive tokens             |
| POST   | `/api/auth/logout`           | Authenticated    | Log out                            |
| POST   | `/api/auth/refresh`          | Authenticated    | Refresh access token               |
| GET    | `/api/user/me`               | user, admin      | Current user profile               |
| GET    | `/api/user/get-all`          | admin            | List all users (paginated)         |
| PATCH  | `/api/user/update`           | user, admin      | Update own profile                 |
| DELETE | `/api/user/delete/:id`       | admin            | Delete a user                      |
| GET    | `/api/user/get-user/:id`     | user, admin      | Get user by id                     |
| GET    | `/api/user/get-email/:email` | admin            | Get user by email                  |
| GET    | `/api/link/my-link`          | user, admin      | List own links                     |
| POST   | `/api/link/generate`         | user, admin      | Create a short link                |
| DELETE | `/api/link/delete/:id`       | user, admin      | Delete own link                    |
| GET    | `/api/redirect/:backHalf`    | user, admin      | Redirect to destination URL        |

## Notes & Known Limitations

- `verify-email` expects a `token` query parameter, matching the link built in `sendVerificationEmail.js`.
- Email sending uses a fresh Ethereal test account per send in `sendEmail.js`; swap in your real transporter for production.
- `CLIENT_ORIGIN` and the CORS whitelist in `src/config/index.js` must match your front-end origin.
