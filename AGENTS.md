# AGENTS.md — Angular 21+ Standalone Application

## Project Identity

| Key | Value |
|-----|-------|
| Framework | Angular 21+ (Standalone Components) |
| Language | TypeScript (strict mode) |
| Category | Frontend SPA |
| State Management | NgRx Signal Store |
| Styling | Tailwind CSS 4 |
| Testing | Vitest + Angular Testing Library |
| Routing | Angular Router (lazy-loaded) |
| i18n | ngx-translate |

---

## Architecture — Layered & Feature-Based

```
src/
├── app/
│   ├── core/               ← Singleton services, guards, interceptors
│   │   ├── auth/           ← AuthService, AuthGuard, token interceptor
│   │   ├── http/           ← API interceptors, error interceptor
│   │   └── layout/         ← Shell component, header, sidebar
│   ├── shared/             ← Reusable pipes, directives, components
│   │   ├── components/     ← UI atoms: button, input, modal, card
│   │   ├── directives/     ← Structural & attribute directives
│   │   └── pipes/          ← Pure transform pipes
│   ├── features/           ← Feature modules (lazy-loaded)
│   │   └── <feature>/
│   │       ├── components/ ← Feature-specific dumb components
│   │       ├── pages/      ← Routed page components
│   │       ├── store/      ← NgRx Signal Store slice
│   │       ├── services/   ← Feature-scoped services
│   │       └── models/     ← Interfaces, types, enums
│   └── app.config.ts       ← provideRouter, provideHttpClient, etc.
├── environments/            ← Environment config files
└── styles/                  ← Global Tailwind layers & theme tokens
```

### Strict Layer Rules

| Layer | Can Import From | NEVER Imports |
|-------|----------------|---------------|
| `pages/` | components/, store/, services/, models/ | Other features, core/ internals |
| `components/` | models/, shared/ | services/, store/, core/ |
| `store/` | services/, models/ | components/, pages/ |
| `services/` | models/, core/http | store/, components/, pages/ |
| `core/` | Nothing feature-specific | features/* |
| `shared/` | Nothing outside shared/ | core/, features/* |

---

## Adding New Code — Where Things Go

### New Feature
1. Create `src/app/features/<feature-name>/`
2. Add page component(s) in `pages/`
3. Add Signal Store in `store/<feature>.store.ts`
4. Register lazy route in `app.routes.ts`
5. Feature services go in `services/`

### New Component
- **Reusable (UI atom)** → `shared/components/<name>/`
- **Feature-specific** → `features/<feature>/components/<name>/`
- Must be standalone: `@Component({ standalone: true, ... })`
- Must use `ChangeDetectionStrategy.OnPush`

### New Service
- **App-wide singleton** → `core/<domain>/` with `providedIn: 'root'`
- **Feature-scoped** → `features/<feature>/services/` with `providedIn: 'any'`

### New Store Slice
- File: `features/<feature>/store/<feature>.store.ts`
- Use `signalStore()` with `withState()`, `withComputed()`, `withMethods()`
- NO class-based stores, NO BehaviorSubject patterns

### New Route
- Lazy-load: `{ path: 'x', loadComponent: () => import('./features/x/pages/x.page') }`
- Never eagerly import feature page components

---

## Design & Architecture Principles

### SOLID in Angular Context
- **S**: One component = one responsibility. A form component doesn't fetch data.
- **O**: Use `@Input()` / signals for extension. Never modify existing components—wrap or compose.
- **L**: All services behind interfaces/abstract classes must be substitutable.
- **I**: Keep interfaces small. `UserService` shouldn't also handle notifications.
- **D**: Inject dependencies via constructor or `inject()`. Never `new Service()`.

### Dependency Injection — Mandatory
```typescript
// ✅ CORRECT — inject()
private readonly userService = inject(UserService);
private readonly store = inject(UserStore);

// ❌ WRONG — manual instantiation
private userService = new UserService();
```

### Signals — Default Reactive Primitive
```typescript
// ✅ Signals for all reactive state
readonly count = signal(0);
readonly doubled = computed(() => this.count() * 2);

// ❌ NO BehaviorSubject for component state
// ❌ NO manual subscription management where signals suffice
```

### OnPush Everywhere
Every component must use `ChangeDetectionStrategy.OnPush`. No exceptions. This forces immutable data flow and prevents performance regressions.

---

## Error Handling

### Fail-Fast at Boundaries
```typescript
// ✅ Validate inputs immediately
updateUser(id: string, data: UpdateUserDto): void {
  if (!id) throw new Error('User ID is required');
  // proceed...
}
```

### Centralized HTTP Error Interceptor
- All HTTP errors flow through `core/http/error.interceptor.ts`
- Maps status codes to user-friendly messages
- 401 → redirect to login, clear auth state
- 500 → generic error toast, log to monitoring
- Never swallow errors silently in `catchError(() => EMPTY)`

### Graceful Degradation
- Components must handle loading/error/empty states explicitly
- Use Angular's `@if`/`@else` blocks for conditional rendering
- A failing API call shows fallback UI, not a blank screen

---

## Code Quality

### Naming Conventions
| Artifact | Convention | Example |
|----------|-----------|---------|
| Component | PascalCase + `.component.ts` | `UserProfileComponent` |
| Service | PascalCase + `.service.ts` | `AuthService` |
| Store | PascalCase + `.store.ts` | `UserStore` |
| Interface/Type | PascalCase, prefix `I` only for DI tokens | `User`, `UpdateUserDto` |
| Pipe | camelCase + `.pipe.ts` | `timeAgo` → `TimeAgoPipe` |
| File names | kebab-case | `user-profile.component.ts` |
| CSS classes | Tailwind utilities; BEM for custom CSS | `btn-primary` |

### Self-Documenting Code
```typescript
// ❌ BAD
const d = u.filter(x => x.a > 5);

// ✅ GOOD
const activeUsers = users.filter(user => user.loginCount > 5);
```

### DRY with AHA Awareness
- Extract only when a pattern appears 3+ times
- Premature abstraction is worse than duplication
- Shared UI → `shared/components/`. Shared logic → `shared/utils/`

### Comment Strategy
- **Don't** comment what the code does (the code should be clear)
- **Do** comment why a non-obvious approach was chosen
- **Do** document public service/store APIs with JSDoc

---

## Testing Strategy

### Test Pyramid
| Level | What | Where | Tool |
|-------|------|-------|------|
| Unit | Services, stores, pipes, utils | `*.spec.ts` co-located | Vitest |
| Component | Input/output behavior, DOM | `*.spec.ts` co-located | Vitest + Angular Testing Library |
| E2E | Critical user flows | `e2e/` | Playwright |

### TDD Requirements
- Write test FIRST for store methods and service functions
- Every public store method needs a test
- Component tests: test behavior (user click → expected output), NOT implementation
- Mock HTTP calls with `provideHttpClientTesting()`

### What MUST Be Tested
- All Signal Store `withMethods()` actions
- All services that make HTTP calls
- All guards and interceptors
- All custom pipes and directives

---

## Security & Performance

### Input Validation
- Validate all user inputs with Angular reactive forms + custom validators
- Sanitize any dynamic HTML (Angular auto-sanitizes, but never bypass with `bypassSecurityTrust*` unless absolutely necessary)
- Never interpolate user input into `innerHTML`

### XSS Prevention
- Use Angular's built-in template binding (safe by default)
- Never use `document.createElement()` or direct DOM manipulation

### Performance Rules
- Lazy-load all feature routes
- Use `@defer` blocks for heavy UI sections
- Use `trackBy` with `@for` loops (mandatory)
- Avoid computations in templates — use `computed()` signals
- Images: use `NgOptimizedImage` directive

### Bundle Size
- No barrel exports (`index.ts`) that cause tree-shaking issues
- Import from specific paths, not package roots when possible
- Analyze with `npx ng build --stats-json` + webpack-bundle-analyzer

---

## Commands

| Action | Command |
|--------|---------|
| Dev server | `npm start` |
| Build | `npm run build` |
| Test | `npm test` |
| Lint | `npm run lint` |
| Format | `npx prettier --write .` |

---

## Prohibitions — NEVER Do These

1. **NEVER** use `NgModule` — this project is 100% standalone
2. **NEVER** use `Default` change detection strategy
3. **NEVER** subscribe to observables in components without `takeUntilDestroyed()`
4. **NEVER** put business logic in components — it belongs in stores/services
5. **NEVER** use `any` type — strict TypeScript at all times
6. **NEVER** import from other feature modules — features are isolated
7. **NEVER** use `@ViewChild` for component communication — use signals/inputs
8. **NEVER** commit `.env` files or API keys
9. **NEVER** use inline styles — use Tailwind utility classes
10. **NEVER** write tests that test Angular internals (lifecycle hooks, CD cycles)
