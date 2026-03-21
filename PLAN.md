# Trumpet Digital Sales Room — Implementation Plan

## Context
Build a web app where users add text widgets to a digital sales room ("pod"). Each widget is independent, has a save button, persists via a JSON file DB, and survives page refresh. This is a technical challenge for Trumpet.

## Tech Stack
| Layer | Choice |
|-------|--------|
| FE | Vue 3 + Vite + Tailwind 3 + TypeScript |
| BE | Express + TypeScript |
| DB | Local JSON file (`lowdb` or raw `fs` read/write) |
| Test | Vitest (FE + BE) |
| Monorepo | npm workspaces |
| Linting | ESLint + Prettier (matching fe-nexus config) |
| Bonus | Docker, delete widgets |

## Project Structure
```
trumpet-challenge/
├── package.json                 # npm workspaces root
├── packages/
│   ├── client/
│   │   ├── package.json
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.js
│   │   ├── .eslintrc.cjs
│   │   ├── .prettierrc
│   │   └── src/
│   │       ├── main.ts
│   │       ├── App.vue
│   │       ├── components/
│   │       │   └── TextWidget.vue
│   │       ├── types/
│   │       │   └── widget.ts
│   │       └── __tests__/
│   │           └── TextWidget.spec.ts
│   └── server/
│       ├── package.json
│       ├── tsconfig.json
│       ├── .eslintrc.cjs
│       └── src/
│           ├── index.ts          # Express app entry
│           ├── routes/
│           │   └── widgets.ts    # CRUD routes
│           ├── db.ts             # JSON file DB layer
│           ├── types/
│           │   └── widget.ts
│           └── __tests__/
│               ├── widgets.spec.ts
│               └── db.spec.ts
├── db.json                       # persisted widget data
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Design
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/api/widgets` | — | `Widget[]` |
| POST | `/api/widgets` | — | `Widget` (new, empty text) |
| PUT | `/api/widgets/:id` | `{ text: string }` | `Widget` |
| DELETE | `/api/widgets/:id` | — | `204` |

### Widget Type
```ts
interface Widget {
  id: number
  text: string
}
```

## DB Layer (`packages/server/src/db.ts`)
- Use `lowdb` (lightweight JSON file database) — reads/writes `db.json` at project root
- Auto-increment ID: track `nextId` in the JSON file
- Schema: `{ nextId: number, widgets: Widget[] }`
- Persists on every write (server restart safe)

## Vite Proxy (matching fe-nexus pattern)
```ts
// packages/client/vite.config.ts
server: {
  port: 3000,
  proxy: {
    "/api": {
      target: "http://localhost:3001",
      changeOrigin: true,
    },
  },
}
```

## Frontend Detail

### App.vue
- "Add Widget" button at top
- Fetches `GET /api/widgets` on mount → renders list
- Each widget rendered as `<TextWidget>`

### TextWidget.vue
- Props: `id`, `initialText`
- `<textarea>` with border, bound to local `ref`
- "Save" button → `PUT /api/widgets/:id` with current text
- "Delete" button → `DELETE /api/widgets/:id` + emit to parent to remove from list
- Visual feedback on save (brief "Saved!" text or button state change)

## ESLint + Prettier Config
Simplified version of fe-nexus config (no cypress, no relative-import plugin for server):
- **Prettier**: double quotes off (singleQuote false), no semi, tabWidth 2, tailwind plugin (client only)
- **ESLint**: vue3-recommended, prettier, typescript, unused-imports

## Testing Strategy

### Server Tests (`packages/server/src/__tests__/`)
- `db.spec.ts` — unit test DB layer (CRUD operations, auto-increment, persistence)
- `widgets.spec.ts` — integration test routes with `supertest` (GET/POST/PUT/DELETE)

### Client Tests (`packages/client/src/__tests__/`)
- `TextWidget.spec.ts` — renders textarea, save button triggers API call, delete emits event
- `App.spec.ts` — add widget button, renders widget list

## Docker (Bonus)
- Multi-stage Dockerfile: build client → serve static from Express in production
- `docker-compose.yml` for single-command startup
- Express serves built client files + API

## Implementation Order
1. Root `package.json` with npm workspaces
2. Server: Express + DB layer + routes + tests
3. Client: Vue + Vite + Tailwind scaffold
4. Client: TextWidget component + App.vue + tests
5. Vite proxy config
6. Docker setup
7. README.md
8. Git init + commits

## Verification
1. `npm install` from root
2. `npm run dev` — starts both client (3000) and server (3001)
3. Add widget → type text → save → refresh page → text persists
4. Delete widget → refresh → widget gone
5. `npm test` — runs vitest for both packages
6. `docker-compose up` — app works at localhost:3000
