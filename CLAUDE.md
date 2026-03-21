# Coding Preferences

## Naming
- camelCase for file names (e.g. `widgetService.ts`, not `widget-service.ts`)

## TypeScript
- No `void` — never use as a return type
- No explicit `unknown` — avoid as a return type workaround
- Meaningful return types — methods should return useful values (e.g. `save` returns saved entity, `remove` returns removed id)
- Avoid explicit `undefined` — prefer optional chaining / optional operator (`?`)
- No unnecessary type annotations — let inference work
- Validate with `tsc --noEmit`, not just tests

## Architecture
- DDD + layered architecture: domain → service → repository → routes
- Domain entities have behavior + validation
- Repository interface in domain layer, implementation separate
- Routes are thin HTTP adapters
- Error middleware maps domain errors to HTTP responses

## Testing
- TDD: red-green-refactor
- Write failing test first, then implement, then refactor
- Additive steps — keep existing tests green throughout

## Database
- JSON file DB (keep it simple)

## Style
- Extreme concision in messages and commit messages
