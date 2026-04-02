---
name: architecture
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - architecture
  - standalone component
  - signal
  - ngrx
  - dependency injection
  - module
  - routing
---

# Architecture — Angular 19 (Standalone + Signals)

## Standalone Components (Default)

- **No NgModules** — all components are standalone by default.
- `@Component({ standalone: true, imports: [...] })` — declare deps inline.
- Routes use `loadComponent` for lazy loading.
- Shared UI: import directly where needed, no SharedModule.

## Signals (Reactive Primitives)

```ts
// Writable signal
count = signal(0);

// Computed (derived)
doubleCount = computed(() => this.count() * 2);

// Effect (side effects)
constructor() {
  effect(() => console.log('Count:', this.count()));
}

// Update
this.count.set(5);
this.count.update(c => c + 1);
```

- Prefer Signals over RxJS for synchronous state.
- Use RxJS for async streams (HTTP, WebSocket, timers).
- `toSignal()` / `toObservable()` to bridge between the two.

## Dependency Injection

```ts
// Modern inject() function (preferred over constructor injection)
private authService = inject(AuthService);
private router = inject(Router);
```

- Use `inject()` in components and services.
- `providedIn: 'root'` for singleton services.
- `providers: [Service]` in component for per-component instances.

## NgRx Signal Store

```ts
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>({ user: null, loading: false }),
  withComputed(({ user }) => ({
    isAuthenticated: computed(() => !!user()),
  })),
  withMethods(({ user, ...store }, authService = inject(AuthService)) => ({
    async login(credentials: LoginDto) {
      patchState(store, { loading: true });
      const result = await authService.login(credentials);
      patchState(store, { user: result, loading: false });
    },
  })),
);
```

## Routing

```ts
export const routes: Routes = [
  { path: '', loadComponent: () => import('./home.component') },
  {
    path: 'dashboard',
    loadComponent: () => import('./layouts/dashboard-layout.component'),
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./dashboard.component') },
      { path: 'settings', loadComponent: () => import('./settings.component') },
    ],
  },
];
```

## Directory Structure

```
src/app/
├── core/           ← Singleton services, guards, interceptors
├── shared/         ← Reusable components, directives, pipes
├── features/       ← Feature folders (each self-contained)
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── login.component.ts
│   │   ├── auth.service.ts
│   │   └── auth.store.ts
│   └── dashboard/
├── layouts/        ← Shell components (sidebar, header)
└── app.routes.ts   ← Top-level route config
```
