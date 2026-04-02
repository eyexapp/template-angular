# Angular Master Template — AI Coding Instructions

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Angular | 21+ |
| **Language** | TypeScript | 5.9 (strict) |
| **State** | NgRx Signal Store | `@ngrx/signals` |
| **Styling** | Tailwind CSS | 4 |
| **i18n** | ngx-translate | 16 |
| **Testing** | Vitest | 4.x |
| **Linting** | ESLint + angular-eslint | 9 |

## Architecture

```
src/app/
├── core/
│   ├── guards/         → Functional CanActivateFn guards
│   ├── interceptors/   → Functional HttpInterceptorFn
│   └── services/       → Singleton services (auth, storage)
├── shared/
│   ├── components/     → Reusable UI (loading-spinner, not-found)
│   ├── directives/     → Shared directives
│   └── pipes/          → Shared pipes
├── features/           → Feature modules (lazy loaded)
│   ├── home/           → Home feature
│   └── auth/           → Auth feature with sub-routes
├── layouts/            → Page layouts (main-layout, auth-layout)
├── models/             → TypeScript interfaces
└── store/              → NgRx Signal Stores
```

## Critical Rules

1. **Standalone-only** — no NgModules. Every component, directive, pipe is `standalone: true`.
2. **OnPush** everywhere — `changeDetection: ChangeDetectionStrategy.OnPush`.
3. **Signals API** — use `signal()`, `computed()`, `input()`, `output()`, `inject()`.
4. **New control flow** — `@if`/`@for`/`@switch` syntax, not `*ngIf`/`*ngFor`.
5. **Functional patterns** — `CanActivateFn` guards, `HttpInterceptorFn` interceptors.
6. **Lazy loading** — `loadComponent`/`loadChildren` in routes.
7. **NgRx Signal Store** for state — not classic NgRx or services-as-state.
8. **Tailwind only** — no component CSS files, no Angular Material.
9. **i18n** — `translate` pipe and `TranslateService`. Keys in `public/i18n/{locale}.json`.

## Naming Conventions

- Files: `kebab-case` with suffix — `auth.guard.ts`, `auth.store.ts`, `user.model.ts`
- Components: `PascalCase` selector prefix `app-` — `app-loading-spinner`
- Stores: `{domain}.store.ts` using `signalStore()`
- Services: `{domain}.service.ts` with `@Injectable({ providedIn: 'root' })`

## Environment Config

- `src/environments/environment.ts` (production)
- `src/environments/environment.development.ts` (dev)
- Access via `environment.apiUrl`, `environment.production`

## Adding a New Feature

1. Create folder under `features/{name}/`
2. Component with `standalone: true`, `OnPush`
3. Add lazy route in `app.routes.ts`
4. Store in `store/{name}.store.ts` if needed
5. Model in `models/{name}.model.ts`
6. Add i18n keys to `public/i18n/en.json` and `public/i18n/tr.json`

## Commands

```bash
npm start         # Dev server
npm run build     # Production build
npm test          # Run Vitest
npm run lint      # ESLint check
```
