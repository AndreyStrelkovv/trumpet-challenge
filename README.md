# Trumpet Digital Sales Room

A web app where users add text widgets to a digital sales room. Each widget is independent, has a save button, and persists via a JSON file database.

## Tech Stack

- **Frontend:** Vue 3 + Vite + Tailwind CSS + TypeScript
- **Backend:** Express + TypeScript
- **Database:** JSON file (lowdb-style fs read/write)
- **Testing:** Vitest + Supertest + Vue Test Utils
- **Monorepo:** npm workspaces

## Prerequisites

- Node v20.18.1
- npm v10.8.2

## Getting Started

```bash
npm install
npm run dev
```

- Client: http://localhost:8080
- Server: http://localhost:3000

## Testing

```bash
npm test
```

## Docker

```bash
docker-compose up --build
```

App available at http://localhost:3000 (Docker) / http://localhost:8080 (dev)

## API

| Method | Endpoint           | Body                                  | Response   |
| ------ | ------------------ | ------------------------------------- | ---------- |
| GET    | `/api/widgets`     | —                                     | `Widget[]` |
| POST   | `/api/widgets`     | `{ text: string, docType?: DocType }` | `Widget`   |
| PUT    | `/api/widgets/:id` | `{ text: string, docType?: DocType }` | `Widget`   |
| DELETE | `/api/widgets/:id` | —                                     | `204`      |

`DocType`: `DOC_TYPE_1` | `DOC_TYPE_2` | `DOC_TYPE_3` | `DOC_TYPE_4`

## Approach & Choices

- **Monorepo** with npm workspaces, `common` holds domain logic, `server`, `client` packages share types and validation
- **DDD + layered architecture** — for readability and maintainability.
- **Explicit save via modal** rather than autosave — keeps user intent clear
- **Shared `common` package** — using it as the domain layer, responsible for enforcing domain throughout the application
- **Docker** — same environment on every machine, no `it works on my machine` excuses

## Tradeoffs

- **JSON file DB** — simple, fast, zero-dependency. However, cannot track changes (e.g. flyway files), cannot query easily
- **In-memory sort/filter** — all widgets loaded then filtered in service layer; fine for small datasets, wouldn't scale

## With More Time

- Authentication for users and authorization for users and admins
- Real database (SQLite/Postgres)
- Rich text editor with text style (bold, italian ...) unordered and ordered lists etc.
- E2E tests (Cypress)
