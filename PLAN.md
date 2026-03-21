# Widget Enhancement Plan

## Features
- `createdAt` / `updatedAt` timestamps on widgets
- Order widgets by date fields (default: `updatedAt desc`)
- 4 doc types: `DOC_TYPE_1` `DOC_TYPE_2` `DOC_TYPE_3` `DOC_TYPE_4`
- Widget can have one or no doc type
- DocType can be set, changed, or cleared
- Filter widgets by doc type
- POST accepts optional initial docType
- Client UI for ordering + filtering

## Execution (TDD per layer)

### 1. Domain entity
- Add `createdAt`, `updatedAt` (Date), `docType?` (DocType)
- `create()` sets both timestamps to now
- `updateText()` / `updateDocType()` bump `updatedAt`
- `DocType` = `DOC_TYPE_1 | DOC_TYPE_2 | DOC_TYPE_3 | DOC_TYPE_4`
- `updateDocType(docType?)` — validates or clears
- Tests: timestamps set on create, bumped on update, docType CRUD, invalid docType

### 2. Types
- `RawWidget` gets `createdAt: string`, `updatedAt: string`, `docType?: string`
- Client `Widget` gets same fields

### 3. DB layer
- `createWidget()` accepts optional `docType`, stores timestamps as ISO strings
- `updateWidget()` accepts `text`, `docType?`, `updatedAt`

### 4. Repository
- Serialize dates as ISO, deserialize back
- Hydrate Widget from raw including new fields
- `create(docType?)` passes through
- `save()` persists all fields

### 5. Service
- `getAll(options?)` with `orderBy` (`createdAt`|`updatedAt`), `order` (`asc`|`desc`), `docType` filter
- Default: `updatedAt desc`
- `create(docType?)` passes through
- `update(id, text, docType?)` — updates both fields

### 6. Routes
- `GET /api/widgets?orderBy=createdAt&order=desc&docType=DOC_TYPE_1`
- Validate query params → 400 if invalid
- `POST /api/widgets` body accepts optional `docType`
- `PUT /api/widgets/:id` body accepts optional `docType`
- Response includes `createdAt`, `updatedAt`, `docType`

### 7. Client
- Update Widget type
- Add order dropdown (createdAt/updatedAt × asc/desc)
- Add docType filter dropdown
- Display docType on widget card
- DocType selector on widget card
