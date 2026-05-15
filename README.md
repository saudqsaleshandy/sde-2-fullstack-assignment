# Email Sequencer — Take-Home

A small email sequencing tool. Users create sequences with timed steps, attach
prospects, schedule sends across mailboxes (each with daily/hourly limits), and
watch a worker process the queue.

> **Read `ASSIGNMENT.md` for what to build and how to submit.**

## Prerequisites

- Node.js 20+
- MySQL 8 running locally
- Redis 6+ running locally
- npm 9+

## Setup

```bash
# 1. Install deps
npm install

# 2. Copy env and edit if your local MySQL/Redis aren't on defaults
cp .env.example .env

# 3. Create the database, apply schema, load seed data
#    (Make sure DB_NAME from .env does NOT already exist, or drop it first.)
mysql -u $DB_USER -p -e "CREATE DATABASE IF NOT EXISTS sequencer;"
npm run setup:db

# 4. Run the API + frontend (in one terminal)
npm run dev

# 5. Run the worker (in another terminal)
npm run worker
```

The API listens on `http://localhost:4000` and the frontend on
`http://localhost:5173`.

## Seed accounts

| Email           | Password    | Notes                            |
|-----------------|-------------|----------------------------------|
| alice@test.com  | password123 | 3 mailboxes, 2 sequences         |
| bob@test.com    | password123 | 1 mailbox, no sequences          |

Alice's first sequence is pre-scheduled so the worker has work as soon as it
starts.

## Scripts

| Command              | What it does                                  |
|----------------------|-----------------------------------------------|
| `npm run dev`        | Starts backend (`tsx watch`) + Vite frontend  |
| `npm run worker`     | Starts the BullMQ worker process              |
| `npm run setup:db`   | Applies `schema.sql` then `seed.sql`          |
| `npm run typecheck`  | TypeScript `--noEmit` on both workspaces      |
| `npm run build`      | Builds backend (tsc) and frontend (vite)      |

## Troubleshooting

- **`ER_ACCESS_DENIED`** — check `DB_USER` / `DB_PASSWORD` in `.env`.
- **`ECONNREFUSED 127.0.0.1:6379`** — Redis isn't running.
- **Worker prints nothing** — make sure you've run `setup:db`; the seed
  pre-schedules sends with `scheduled_at = NOW()` so they should fire
  immediately.
