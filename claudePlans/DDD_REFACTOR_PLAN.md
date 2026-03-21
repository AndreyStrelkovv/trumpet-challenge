# DDD + Layered Architecture Refactor — TDD Plan

## Context
Refactor server from flat route→db architecture to DDD layered architecture (domain → service → repository) using TDD. Keeps existing JSON file DB. Every step keeps existing tests green until the final swap.

## Target Structure
```
packages/server/src/
├── domain/
│   ├── widget.ts              # entity w/ behavior + validation
│   ├── widget-repository.ts   # repository interface (no infra deps)
│   └── errors.ts              # DomainError, NotFoundError, ValidationError
├── repositories/
│   └── json-widget-repository.ts  # wraps existing createDb
├── services/
│   └── widget-service.ts      # use cases
├── routes/
│   └── widgets.ts             # thin HTTP adapter → service
├── middleware/
│   └── error-handler.ts       # domain errors → HTTP status
├── db.ts                      # kept as-is (used by repo internally)
├── app.ts                     # updated: takes service instead of db
├── index.ts                   # updated: wires db → repo → service → app
└── __tests__/
    ├── domain/
    │   ├── errors.spec.ts
    │   └── widget.spec.ts
    ├── repositories/
    │   └── json-widget-repository.spec.ts
    ├── services/
    │   └── widget-service.spec.ts
    ├── middleware/
    │   └── error-handler.spec.ts
    └── routes/
        └── widgets.spec.ts    # updated existing integration test
```

## TDD Steps (red-green-refactor)

### Step 1 — Domain Errors (additive, zero risk)
**Test**: `__tests__/domain/errors.spec.ts`
- `NotFoundError` extends `DomainError`, carries entity name + id
- `ValidationError` extends `DomainError`, carries message

**Impl**: `domain/errors.ts`

### Step 2 — Domain Entity: Widget (additive, zero risk)
**Test**: `__tests__/domain/widget.spec.ts`
- `Widget.create(id, text)` returns Widget
- `widget.updateText("new")` updates text
- `widget.updateText("")` throws `ValidationError`
- `widget.updateText("x".repeat(10001))` throws `ValidationError`

**Impl**: `domain/widget.ts` — class with static `create()`, `updateText()` method, readonly `id`/`text` getters

### Step 3 — Repository Interface (no test needed, just a TS interface)
**Impl**: `domain/widget-repository.ts`
```ts
interface WidgetRepository {
  findAll(): Widget[]
  findById(id: number): Widget | undefined
  create(): Widget
  save(widget: Widget): void
  remove(id: number): void
}
```

### Step 4 — JSON Widget Repository (additive, zero risk)
**Test**: `__tests__/repositories/json-widget-repository.spec.ts`
- Uses `createDb(":memory:")` internally
- `findAll()` → empty initially
- `create()` → returns Widget entity w/ auto-increment id
- `findById(id)` → returns Widget or undefined
- `save(widget)` → persists text changes
- `remove(999)` → throws `NotFoundError`

**Impl**: `repositories/json-widget-repository.ts` — adapts existing `Db` interface to `WidgetRepository`

### Step 5 — Widget Service (additive, zero risk)
**Test**: `__tests__/services/widget-service.spec.ts`
- Mock `WidgetRepository` with `vi.fn()`
- `getAll()` delegates to repo
- `create()` delegates to repo
- `update(id, text)` → findById + updateText + save
- `update(999, text)` → throws `NotFoundError`
- `update(id, "")` → throws `ValidationError` (from entity)
- `delete(id)` → delegates to repo.remove

**Impl**: `services/widget-service.ts`

### Step 6 — Error Middleware (additive, zero risk)
**Test**: `__tests__/middleware/error-handler.spec.ts`
- `NotFoundError` → 404 `{ error: "Not found" }`
- `ValidationError` → 400 `{ error: message }`
- Unknown error → 500

**Impl**: `middleware/error-handler.ts`

### Step 7 — Rewire (the only step that touches existing code)
**Modify**: `routes/widgets.ts`, `app.ts`, `index.ts`
**Update test**: move `__tests__/widgets.spec.ts` → `__tests__/routes/widgets.spec.ts`

Changes:
- `routes/widgets.ts`: takes `WidgetService` instead of `Db`, handlers wrap in try/catch + next(err)
- `app.ts`: `createApp(service)` instead of `createApp(db)`, adds error middleware
- `index.ts`: wires `createDb → JsonWidgetRepository → WidgetService → createApp`
- Test setup: `db → repo → service → createApp(service)`
- Add test: PUT with empty text → 400

All existing test assertions stay the same (same HTTP behavior).

### Step 8 — Cleanup
- Remove `Widget` export from `types/widget.ts` (keep only `DbSchema`)
- Delete `db.spec.ts` — persistence now tested through repo layer

## Verification
1. After each step: `npm test` — all tests green
2. After step 7: `npm run dev` → add widget → edit → save → refresh → persists
3. After step 7: PUT with empty text returns 400

## Decisions
- `updateText("")` throws `ValidationError` — empty saves blocked
- `db.spec.ts` replaced by `json-widget-repository.spec.ts` — test persistence through repo layer only
- Max text length: 10000 chars
