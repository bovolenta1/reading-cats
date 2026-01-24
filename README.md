# Reading Cats API — Setup & Development Guide (Windows + AWS SAM + Neon Postgres)

This repo is the backend API for **Reading Cats**, built with **Go**, deployed on **AWS Lambda + API Gateway (HTTP API)** using **AWS SAM**, and backed by **Postgres (Neon)**.

- Runtime: **AWS Lambda** (`provided.al2023`) + **API Gateway HTTP API**
- DB migrations: **golang-migrate**
- Local dev: **SAM Local** + Docker Desktop
- Local config: **.env.local** (loaded via `godotenv`)

---

## Table of Contents

- [Reading Cats API — Setup \& Development Guide (Windows + AWS SAM + Neon Postgres)](#reading-cats-api--setup--development-guide-windows--aws-sam--neon-postgres)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
    - [Required](#required)
    - [Recommended](#recommended)
  - [Project layout (high level)](#project-layout-high-level)
  - [Environment variables](#environment-variables)
    - [`.env.local` (local only)](#envlocal-local-only)
  - [Local development (SAM)](#local-development-sam)
    - [One-time setup (dependency)](#one-time-setup-dependency)
    - [Build](#build)
    - [Start the API locally (HTTP)](#start-the-api-locally-http)
      - [Test `/v1/me`](#test-v1me)
    - [Clean SAM artifacts](#clean-sam-artifacts)
  - [Database migrations](#database-migrations)
    - [Install migrate CLI](#install-migrate-cli)
    - [Create a new migration](#create-a-new-migration)
    - [Run migrations locally](#run-migrations-locally)
    - [Migration files example (create\_user)](#migration-files-example-create_user)
  - [Production: how to run migrations](#production-how-to-run-migrations)
    - [Recommended: GitHub Actions step](#recommended-github-actions-step)
    - [Concurrency / safety](#concurrency--safety)
  - [Troubleshooting](#troubleshooting)
    - [SAM local doesn't see `.env.local`](#sam-local-doesnt-see-envlocal)
    - [`/v1/me` returns 401](#v1me-returns-401)
    - [`migrate` not found](#migrate-not-found)
    - [Driver errors with `postgresql://`](#driver-errors-with-postgresql)
    - [Neon SSL errors](#neon-ssl-errors)
  - [Makefile reference](#makefile-reference)

---

## Prerequisites

### Required
- **Go** installed and available in PATH:
  - `go version`
- **AWS SAM CLI** installed:
  - `sam --version`
- **Docker Desktop** installed (required by `sam local`)
- **Postgres database** (Neon) and a connection string

### Recommended
- **GNU Make** installed (Windows):
  - `choco install make -y`
  - `make --version`

---

## Project layout (high level)

Typical structure (may evolve as features grow):

- `main.go` — Lambda entry point (DI + router)
- `internal/` — application code (presentation/application/domain/infra)
- `migrations/` — SQL migrations (golang-migrate format)
- `template.yaml` — AWS SAM template
- `Makefile` — local dev + migration commands

---

## Environment variables

### `.env.local` (local only)

Create `.env.local` at the repo root (do **not** commit it):

```env
DATABASE_URL=postgres://USER:PASSWORD@HOST/DBNAME?sslmode=require
```

Notes:
- Keep credentials out of Git. Add `.env.local` to `.gitignore`.

Example `.gitignore` entry:

```gitignore
.env.local
```

---

## Local development (SAM)

> **Important:** `sam local` runs your function inside a container and does **not** automatically read `.env.local`.
>
> For local development, this repo:
> 1) loads `.env.local` at runtime using `github.com/joho/godotenv`, and  
> 2) copies `.env.local` into the SAM build output folder so it exists inside the container.

### One-time setup (dependency)
If you haven’t yet:

```bash
go get github.com/joho/godotenv
```

Your config loader should call something like:

```go
_ = godotenv.Load(".env.local")
```

### Build
```bash
make build
```

### Start the API locally (HTTP)
```bash
make start
```

Default: `http://localhost:3001`

#### Test `/v1/me`

`/v1/me` expects a JWT Bearer token in production.

- Without `Authorization`, it should return **401** (not crash).
- With a token:

```bash
curl -i http://127.0.0.1:3001/v1/me -H "Authorization: Bearer <JWT>"
```

---

### Clean SAM artifacts
```bash
make clean
```

---

## Database migrations

This project uses **golang-migrate/migrate**:
- Each migration has two files:
  - `NNNNNN_name.up.sql`
  - `NNNNNN_name.down.sql`

### Install migrate CLI

Install the CLI with Postgres support:

```bash
go install -tags "postgres" github.com/golang-migrate/migrate/v4/cmd/migrate@latest
```

Ensure your Go bin is in PATH (usually `C:\Users\<you>\go\bin`).

Check:

```bash
migrate -version
```

---

### Create a new migration

```bash
make migrate-create name=create_groups
```

This generates:
- `migrations/000002_create_groups.up.sql`
- `migrations/000002_create_groups.down.sql`

---

### Run migrations locally

Run all pending migrations:

```bash
make migrate-up
```

Show current version:

```bash
make migrate-version
```

Rollback a single migration:

```bash
make migrate-down
```

---

### Migration files example (create_user)

**`migrations/000001_create_user.up.sql`**

```sql
CREATE TABLE IF NOT EXISTS users (
  id             UUID PRIMARY KEY,
  cognito_sub    TEXT NOT NULL UNIQUE,
  email          TEXT,
  display_name   TEXT,
  avatar_url     TEXT,
  profile_source TEXT NOT NULL DEFAULT 'idp', -- 'idp' | 'user'
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Email optional, but unique when present (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique
ON users (lower(email))
WHERE email IS NOT NULL;
```

**`migrations/000001_create_user.down.sql`**

```sql
DROP INDEX IF EXISTS users_email_unique;
DROP TABLE IF EXISTS users;
```

---

## Production: how to run migrations

### Recommended: GitHub Actions step

Run migrations as part of your CI/CD pipeline **before** `sam deploy`.

Example (Ubuntu runner):

```yaml
- name: Install migrate
  run: |
    go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
    echo "$(go env GOPATH)/bin" >> $GITHUB_PATH

- name: Run migrations
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL_PROD }}
  run: |
    migrate -path migrations -database "$DATABASE_URL" up

- name: Build
  run: sam build

- name: Deploy
  run: sam deploy --no-confirm-changeset --no-fail-on-empty-changeset
```

### Concurrency / safety

- Ensure only **one deployment** runs at a time (to avoid concurrent migrations).
- GitHub Actions tip: use workflow `concurrency` to serialize deploys.
- Prefer **forward-only** migrations in production (down is mainly for local/dev).
- Avoid editing old migrations that have already run in production.

---

## Troubleshooting

### SAM local doesn't see `.env.local`

Symptoms:
- `panic: missing env var: DATABASE_URL` inside SAM local, even though `.env.local` exists.

Fix:
- Ensure your config loader calls `godotenv.Load(".env.local")`.
- Ensure `make start` copies the file into SAM build output:
  - `.aws-sam/build/<FunctionLogicalId>/.env.local`

If you renamed your Lambda logical ID in `template.yaml`, update the Makefile variable (see [Makefile reference](#makefile-reference)).

### `/v1/me` returns 401

This is expected if you call it without a JWT:

```bash
curl -i http://127.0.0.1:3001/v1/me
```

Provide an Authorization header:

```bash
curl -i http://127.0.0.1:3001/v1/me -H "Authorization: Bearer <JWT>"
```

### `migrate` not found

Your Go bin folder is not in PATH. Add:
- `C:\Users\<you>\go\bin`

Check:

```bash
where.exe migrate
migrate -version
```

### Driver errors with `postgresql://`

Some tooling expects `postgres://`. If you hit issues, try switching the scheme in `.env.local`:
- from `postgresql://...` to `postgres://...`

The Makefile migration targets also normalize `postgresql://` → `postgres://` when needed.

### Neon SSL errors

Ensure your URL includes:

- `sslmode=require`

---

## Makefile reference

A minimal Makefile for this setup (Windows / cmd-friendly):

```makefile
-include .env.local
export

.PHONY: build start clean copy-env migrate-create migrate-up migrate-down migrate-version

PORT ?= 3001
SAM_FUNCTION_ID ?= HelloFunction

MIGRATIONS_DIR = migrations
MIGRATE = migrate

# Normalize scheme for migrate (some setups prefer postgres://)
DATABASE_URL_MIGRATE := $(patsubst postgresql://%,postgres://%,$(DATABASE_URL))

build:
    sam build --clean

# Copy .env.local into the SAM build output so it exists inside the container at /var/task/.env.local
copy-env:
    powershell -NoProfile -Command "Copy-Item -Force .\.env.local .\.aws-sam\build\$(SAM_FUNCTION_ID)\.env.local"

start: build copy-env
    sam local start-api -p $(PORT) --debug

clean:
    @if exist .aws-sam rmdir /s /q .aws-sam

# usage: make migrate-create name=create_user
migrate-create:
    @if "$(name)"=="" (echo use: make migrate-create name=create_user & exit /b 1)
    $(MIGRATE) create -ext sql -dir $(MIGRATIONS_DIR) -seq $(name)

migrate-up:
    @if "$(DATABASE_URL)"=="" (echo DATABASE_URL not set. Put it in .env.local & exit /b 1)
    $(MIGRATE) -path $(MIGRATIONS_DIR) -database "$(DATABASE_URL_MIGRATE)" up

migrate-down:
    @if "$(DATABASE_URL)"=="" (echo DATABASE_URL not set. Put it in .env.local & exit /b 1)
    $(MIGRATE) -path $(MIGRATIONS_DIR) -database "$(DATABASE_URL_MIGRATE)" down 1

migrate-version:
    @if "$(DATABASE_URL)"=="" (echo DATABASE_URL not set. Put it in .env.local & exit /b 1)
    $(MIGRATE) -path $(MIGRATIONS_DIR) -database "$(DATABASE_URL_MIGRATE)" version
```

---

If you want, add a dedicated section later for:
- `/v1/me` endpoint contract
- Cognito JWT authorizer configuration
- local testing with sample JWT (or local bypass mode)
