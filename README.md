<a name="readme-top"></a>

<br />
<div align="center">
  <a href="https://neakhatka.com/">
    <img src="https://neakhatka.com/logo.svg" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">Neakhatka</h3>
  <p align="center">An internship marketplace connecting students and recent graduates with companies across Cambodia.</p>
</div>

## Table of contents

- [About the project](#about-the-project)
- [Features](#features)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Testing and CI](#testing-and-ci)
- [Deployment](#deployment)
- [Project structure](#project-structure)
- [Known limitations](#known-limitations)
- [Contact](#contact)

## About the project

Neakhatka is dedicated to connecting students and recent graduates with valuable internship experiences across Cambodia. Our user-friendly website offers a comprehensive database of internship opportunities in various industries, helping you kickstart your career and gain practical experience. Start your journey towards a successful career today with <a href="https://www.canva.com/design/DAGE7Fg9Oqg/anzWbiic07MlDBmKUWN5wA/edit?utm_content=DAGE7Fg9Oqg&amp;utm_campaign=designshare&amp;utm_medium=link2&amp;utm_source=sharebutton" target="_blank">Neakhatka</a>!

### Our vision

Change the way companies and internship seekers connect, make it easier and more effective.
<a href="https://www.canva.com/design/DAGGJAb9sDU/FqSE7DVtbMQpw5yNbCbpOA/edit?utm_content=DAGGJAb9sDU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton" target="_blank">Product vision board</a>

### Our mission

Build a simple platform that helps both companies and seekers by matching job requirements with seekers' skills.

### UI design

* [![Static Badge](https://img.shields.io/badge/Figma-2C2D34?style=for-the-badge&logo=figma&logoColor=fff&color=%232C2D34)](https://www.figma.com/design/Cvvmjfhl1K2c8EkXBRK3OF/Neakhatka?node-id=22-18&t=3YcYKBcPRNFPZCh9-1)

### Built with

* [![Next][Next.js]][Next-url]
* [![Static Badge](https://img.shields.io/badge/Docker%20Desktop-1D63ED?style=for-the-badge&logo=docker&logoColor=fff)](https://www.docker.com/products/docker-desktop/)
* [![Static Badge](https://img.shields.io/badge/Node.js-499442?style=for-the-badge&logo=node.js&logoColor=fff&color=499442)](https://nodejs.org/en)
* [![Static Badge](https://img.shields.io/badge/Tyscript-3178C6?style=for-the-badge&logo=typescript&logoColor=fff&color=3178C6)](https://www.typescriptlang.org/)
* [![Static Badge](https://img.shields.io/badge/Express.js-000?style=for-the-badge&logo=express&logoColor=fff&color=000)](https://expressjs.com/)
* [![Static Badge](https://img.shields.io/badge/Mongodb-%23023430?style=for-the-badge&logo=mongodb&logoColor=fff&color=%23023430)](https://www.mongodb.com/)

Also: RabbitMQ (service-to-service messaging), AWS S3 (uploads), tsoa (typed controllers + Swagger), Tailwind CSS and shadcn/ui, SST (frontend hosting), Terraform (backend infrastructure).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

**Internship seekers**
- Sign up with email (with email verification) or Google
- Browse job posts and view job details
- Save favorite jobs
- Create and edit a seeker profile

**Employers**
- Employer sign-up and company profile (logo upload to S3)
- Dashboard to create, edit and delete job posts
- See all jobs the company has posted

**Platform**
- RS256 JWT authentication checked once at the API gateway, stored in a cookie session
- Per-visitor rate limiting at the gateway
- Transactional emails (verify email, reset password) sent asynchronously through RabbitMQ
- Swagger/OpenAPI specs generated per service with tsoa

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Architecture

Neakhatka is a monorepo: a Next.js frontend plus five Node.js/Express microservices written in TypeScript. The browser only ever talks to the API gateway.

```mermaid
flowchart LR
    U[Browser] --> APP[Next.js app<br/>:3000]
    APP --> GW[API gateway<br/>:4000]
    GW --> AUTH[auth-service<br/>:4001]
    GW --> PROF[profile-service<br/>:4003]
    GW --> COMP[company-service<br/>:4004]
    AUTH -- "create profile on verify" --> PROF
    AUTH -- "create company on verify" --> COMP
    AUTH -- "email events" --> MQ[(RabbitMQ)]
    MQ --> NOTI[notification<br/>:4002]
    NOTI --> SMTP[SMTP server]
    AUTH --> DB[(MongoDB)]
    PROF --> DB
    COMP --> DB
    COMP --> S3[(AWS S3)]
```

| Service | Port | Responsibility |
|---|---|---|
| `app` | 3000 | Next.js 14 frontend (seeker and employer UI) |
| `packages/api-gateway` | 4000 | Single entry point: verifies JWTs with the public key, manages the cookie session, rate-limits, proxies to services |
| `packages/auth-service` | 4001 | Sign-up, login, email verification, Google OAuth; signs JWTs with the private key |
| `packages/notification` | 4002 | Consumes RabbitMQ email events and sends emails over SMTP (EJS templates) |
| `packages/profile-service` | 4003 | Seeker profiles and favorite jobs |
| `packages/company-service` | 4004 | Company profiles, logo upload to S3, job posts |

Each service follows the same layout: `routes` → `controller` → `service` → `database/repository` → Mongoose `model`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting started

### Prerequisites

- [Node.js 20](https://nodejs.org/) and npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (runs the services and RabbitMQ)
- A MongoDB database. MongoDB is **not** part of `docker-compose.yaml`, so use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works) or your own instance.
- For emails: an SMTP account (for example a Gmail app password)
- For company logos: an AWS S3 bucket and access keys
- Optional, for "Sign in with Google": a Google OAuth client

### 1. Clone and install

```sh
git clone https://github.com/neakhatka/neakhatka.git
cd neakhatka
npm install            # installs all backend services (npm workspaces)
cd app && npm install  # the frontend has its own lockfile
```

### 2. Generate the JWT key pair

auth-service signs tokens with a private key; the gateway verifies them with the matching public key.

```sh
openssl genpkey -algorithm RSA -out packages/auth-service/private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -in packages/auth-service/private_key.pem -pubout -out packages/api-gateway/public_key.pem
```

`*.pem` files are git-ignored, except the gateway's public key. If you generate a new pair, commit the new `public_key.pem` too.

### 3. Create the `.env` files

Every service has a template at `packages/<service>/configs/.env.sample`:

```sh
for s in api-gateway auth-service company-service notification profile-service; do
  cp packages/$s/configs/.env.sample packages/$s/configs/.env
done
```

Fill them in using the [environment variables](#environment-variables) table. Inside Docker, services reach each other by compose service name, for example:

- `RABBITMQ_ENDPOINT=amqp://myuser:mypassword@rabbitmq:5672`, using the credentials from `docker-compose.yaml`
- `API_GATEWAY=http://api-gateway:4000`

### 4. Run the backend

```sh
npm run start:build   # docker compose up --build
```

RabbitMQ's management UI is at http://localhost:15672.

### 5. Run the frontend

```sh
cd app
npm run dev
```

Open http://localhost:3000.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Environment variables

Each service validates its variables at startup (see `src/utils/config.ts` or `src/util/config.ts`) and refuses to boot if a required one is missing.

| Service | Required | Optional / feature-specific |
|---|---|---|
| api-gateway | `NODE_ENV`, `PORT`, `LOG_LEVEL`, `CLIENT_URL`, `COOKIE_SECRET_KEY_ONE`, `COOKIE_SECRET_KEY_TWO`, `AUTH_SERVICE_URL`, `USER_SERVICE_URL`, `COMPANY_SERVICE_URL` | `NOTIFICATION_SERVICE_URL` |
| auth-service | `NODE_ENV`, `PORT`, `MONGODB_URL`, `LOG_LEVEL`, `RABBITMQ_ENDPOINT`, `JWT_EXPIRES_IN` (e.g. `1d`) | `API_GATEWAY`, `CLIENT_ID` / `CLIENT_SECRET` / `REDIRECT_URI` (Google OAuth) |
| notification | `NODE_ENV`, `PORT`, `CLIENT_URL`, `LOG_LEVEL`, `RABBITMQ_ENDPOINT`, `SENDER_EMAIL`, `SENDER_EMAIL_PASSWORD`, `SMTP_HOST`, `SMTP_PORT` | |
| profile-service | `MONGODB_URL`, `LOG_LEVEL`, `PORT`, `API_GATEWAY`, `AUTH_SERVICE` | |
| company-service | `MONGODB_URL`, `LOG_LEVEL`, `PORT`, `API_GATEWAY`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` | `S3_BUCKET_NAME` (needed for logo upload) |

| app | | `NEXT_PUBLIC_API_URL`: public URL of the API gateway (default `http://localhost:4000`). It's inlined at build time, so set it before `npm run build` / `sst deploy`. See `app/.env.example`. |

`docker-compose.yaml` already sets the gateway's `*_SERVICE_URL` values, so you only need them in `.env` when running outside Docker.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Testing and CI

Every backend service has a Jest test suite (ts-jest). Unit tests mock the database, RabbitMQ and HTTP calls, so they need no running infrastructure.

```sh
cd packages/auth-service && npm test     # same in every service
npm run test:watch                       # watch mode (auth, company, profile)
```

company-service also has repository integration tests that run against an in-memory MongoDB ([mongodb-memory-server](https://github.com/typegoose/mongodb-memory-server)):

```sh
cd packages/company-service && npm run test:integration
```

> mongodb-memory-server downloads a MongoDB binary on first run. MongoDB doesn't publish binaries for Windows on ARM, so on those machines run the integration tests in CI or WSL.

**CI** (`.github/workflows/ci.yml`) runs on every push and pull request to `Development` and `package`:

- each backend service: `npm ci` → `npm run build` → `npm test`, plus the company-service integration tests
- the frontend: `npm ci` → `npm run lint` → `npm run build`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Deployment

- **Frontend**: deployed to AWS with [SST](https://sst.dev/) (`app/sst.config.ts`, a Next.js site on the `neakhatka.com` Route 53 hosted zone). Set `NEXT_PUBLIC_API_URL` to the deployed gateway's URL first. `.github/workflows/main.yml` deploys `prod` on push to `main` using the `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` repository secrets. You can also deploy by hand:
  ```sh
  cd app && npm run deploy:dev       # or deploy:staging / deploy:prod
  ```
- **Backend**: `infras/` holds Terraform for an EC2 instance, its IAM role, and S3 buckets (with remote state in S3 + DynamoDB locking). `script/setup_environment.sh` and `script/setup_rabbitmq.sh` provision Node.js 20, Yarn, PM2 and RabbitMQ on the instance. Each service builds with `npm run build` and runs under PM2 with `npm start` (`ecosystem.config.js`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Project structure

```
neakhatka
├── .github/workflows    # ci.yml (build + test), main.yml (frontend deploy)
├── app                  # Next.js 14 frontend (App Router, Tailwind, shadcn/ui, SST)
│   └── src
│       ├── app          # routes: (auth), (post), (profile), dashboard, detail, ...
│       ├── components
│       ├── contexts
│       ├── lib          # API helpers
│       └── validation   # form schemas
├── packages             # backend microservices (npm workspaces)
│   ├── api-gateway
│   ├── auth-service
│   ├── company-service
│   ├── notification
│   └── profile-service
├── infras               # Terraform (EC2, IAM, S3)
├── script               # server provisioning scripts
└── docker-compose.yaml  # local backend stack + RabbitMQ
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Known limitations

- MongoDB isn't in `docker-compose.yaml`, so local development needs an external database.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Neakhatka - neakhatka@gmail.com <br/>
Team members - svatmanith76@gmail.com - sanvisal2302@gmail.com - rathna.chh@gmail.com

Project Link: [https://github.com/neakhatka/neakhatka](https://github.com/neakhatka/neakhatka)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
