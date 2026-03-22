# Trumpet Digital Sales Room

A web app where users add text widgets to a digital sales room. Each widget is independent, has a save button, and persists via a JSON file database.

## Tech Stack

- **Frontend:** Vue 3 + Vite + Tailwind CSS + TypeScript
- **Backend:** Express + TypeScript
- **Database:** JSON file (lowdb-style fs read/write)
- **Testing:** Vitest + Supertest + Vue Test Utils
- **Monorepo:** npm workspaces

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

| Method | Endpoint           | Body             | Response   |
|--------|--------------------|------------------|------------|
| GET    | `/api/widgets`     | —                | `Widget[]` |
| POST   | `/api/widgets`     | —                | `Widget`   |
| PUT    | `/api/widgets/:id` | `{ text: string }` | `Widget`   |
| DELETE | `/api/widgets/:id` | —                | `204`      |
