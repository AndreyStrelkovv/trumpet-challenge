# Move domain layer to common package

## Context

Common package currently holds only shared types/constants (`docType`, `sorting`, `Widget` interface). The full domain layer (`errors.ts`, `Widget` class, `widgetRepository` interface) lives in `packages/server/src/domain/` but has zero server-specific dependencies — it's pure TypeScript. Moving it to common makes the domain the true shared core, and the server's `domain/` folder becomes thin re-exports.

## Plan

### 1. Move domain files to `packages/common/src/`

**`errors.ts`** — move as-is (no dependencies)
```
DomainError, NotFoundError, ValidationError
```

**`widget.ts`** — merge current `common/src/docType.ts` + `common/src/widget.ts` + server `domain/widget.ts` into one file:
- `DOC_TYPES`, `DocType`, `isValidDocType()` (from current `docType.ts`)
- `Widget` class with behavior + validation (from server `domain/widget.ts`)
- `Widget` API interface → rename to `WidgetDTO` (serialized shape with string dates, used by client)
- Import `ValidationError` from `./errors` (within common)

**`widgetRepository.ts`** — move as-is, update import to local `./widget`
```ts
export interface WidgetRepository {
  findAll(): Widget[]
  findById(id: number): Widget | undefined
  create(text: string, docType?: DocType): Widget
  save(widget: Widget): Widget
  remove(id: number): number
}
```

**`sorting.ts`** — already in common, no changes needed

### 2. Delete `common/src/docType.ts`

Its contents merge into `common/src/widget.ts`.

### 3. Update `common/package.json` exports

```json
{
  "exports": {
    "./errors": { "types": "./src/errors.ts", "import": "./dist/errors.js", "default": "./src/errors.ts" },
    "./sorting": { "...": "unchanged" },
    "./widget": { "types": "./src/widget.ts", "import": "./dist/widget.js", "default": "./src/widget.ts" },
    "./widgetRepository": { "types": "./src/widgetRepository.ts", "import": "./dist/widgetRepository.js", "default": "./src/widgetRepository.ts" }
  }
}
```

Remove `./docType` export (merged into `./widget`).

### 4. Server `domain/` becomes re-export wrappers

Each file re-exports from common so **no server imports need changing** (services, routes, repos, middleware, tests all keep their `../domain/X.js` paths).

**`server/src/domain/errors.ts`**
```ts
export { DomainError, NotFoundError, ValidationError } from "common/errors"
```

**`server/src/domain/widget.ts`**
```ts
export { Widget, DOC_TYPES, isValidDocType } from "common/widget"
export type { DocType, WidgetDTO } from "common/widget"
```

**`server/src/domain/widgetRepository.ts`**
```ts
export type { WidgetRepository } from "common/widgetRepository"
```

**`server/src/domain/sorting.ts`** — already re-exports from common, no change.

### 5. Update client types

**`client/src/types/widget.ts`**
```ts
export { DOC_TYPES } from "common/widget"
export type { DocType, WidgetDTO as Widget } from "common/widget"
```

Re-alias `WidgetDTO` → `Widget` so client code stays unchanged.

**`client/src/types/sorting.ts`** — already re-exports from common, no change.

## Verification

- `tsc --noEmit` in common, server, client
- `npm run build` at root
- `npm test` at root (all 86 tests pass)
- `npm run dev` — runtime sanity check

## Files touched

| Action | Path |
|---|---|
| Rewrite | `packages/common/src/widget.ts` (merge docType + Widget class + WidgetDTO) |
| Create | `packages/common/src/errors.ts` |
| Create | `packages/common/src/widgetRepository.ts` |
| Delete | `packages/common/src/docType.ts` |
| Edit | `packages/common/package.json` (exports) |
| Rewrite | `packages/server/src/domain/errors.ts` (re-export) |
| Rewrite | `packages/server/src/domain/widget.ts` (re-export) |
| Rewrite | `packages/server/src/domain/widgetRepository.ts` (re-export) |
| Edit | `packages/client/src/types/widget.ts` (WidgetDTO alias) |

## Decisions

- **Naming:** `Widget` interface renamed to `WidgetDTO`. Client re-aliases `WidgetDTO as Widget` for zero downstream changes.
