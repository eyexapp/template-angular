---
name: code-quality
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - clean code
  - naming
  - lint
  - style
  - decorator
  - refactor
---

# Code Quality — Angular 19 + TypeScript

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Component | kebab-case selector | `app-user-card` |
| Component file | kebab-case.component | `user-card.component.ts` |
| Service | camelCase.service | `auth.service.ts` |
| Store | camelCase.store | `auth.store.ts` |
| Guard | camelCase + Guard | `authGuard` (functional) |
| Interceptor | camelCase + Interceptor | `authInterceptor` (functional) |
| Pipe | camelCase.pipe | `currency-format.pipe.ts` |
| Interface | PascalCase (no I prefix) | `User`, `LoginDto` |

## Component Patterns

### Inline Template (Small Components)

```ts
@Component({
  selector: 'app-badge',
  template: `<span class="badge" [class]="type()">{{ label() }}</span>`,
})
export class BadgeComponent {
  label = input.required<string>();
  type = input<'info' | 'warn'>('info');
}
```

### Signal Inputs/Outputs (Angular 19)

```ts
// Input (replaces @Input())
name = input.required<string>();
size = input<number>(16);

// Output (replaces @Output())
clicked = output<MouseEvent>();

// Model (two-way binding)
value = model<string>('');
```

## Functional Guards & Interceptors

```ts
// auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthStore);
  return auth.isAuthenticated() || inject(Router).createUrlTree(['/login']);
};

// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthStore).token();
  if (token) req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  return next(req);
};
```

## Linting — ESLint + @angular-eslint

- `ng lint` — runs Angular-specific ESLint rules.
- Enforces: standalone components, signal usage, no deprecated patterns.
- Strict TypeScript: `strict: true` in `tsconfig.json`.
