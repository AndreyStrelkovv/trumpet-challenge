# Coding Preferences

## Naming

- PascalCase for Vue component files (e.g. `EditWidgetModal.vue`)
- camelCase for all other files (e.g. `widgetService.ts`, not `widget-service.ts`)
- No single-letter variable names, including lambda params — use full descriptive names

## TypeScript

- No `void` — never use as a return type
- No explicit `unknown` — avoid as a return type workaround
- Meaningful return types — methods should return useful values (e.g. `save` returns saved entity, `remove` returns removed id)
- Avoid explicit `undefined` — prefer optional chaining / optional operator (`?`)
- No unnecessary type annotations — let inference work
- No `!== undefined` / `!== null` — use truthy/falsy (`if (x)`, `if (!x)`)
- Avoid unnecessary casting `as any` / `as Type`
- Prefer `const name = (...) => {...}` over `function name(...) {...}`
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

## Communication

- Extreme concision in messages and commit messages

## Plans

- End each plan with unresolved questions (if any), extremely concise

### Imports

- Always use `@/` alias — never relative imports (`../`, `./`)
- Import order must follow prettier config: `@/components` → `@/views` → `@/assets` → relative
- No unused imports
- Use `import type` for type-only imports
