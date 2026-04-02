---
name: security-performance
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - security
  - performance
  - change detection
  - lazy load
  - ssr
  - xss
  - optimize
---

# Security & Performance — Angular 19

## Performance

### Change Detection with Signals

- Signals enable **zoneless change detection** — no Zone.js overhead.
- `provideZonelessChangeDetection()` — opt-in for the app.
- Components using signals only re-render when signal values actually change.
- `OnPush` change detection: component only checks when inputs/signals change.

### Lazy Loading

```ts
// Route-level lazy loading
{ path: 'admin', loadComponent: () => import('./admin.component') }

// Feature route lazy loading
{ path: 'reports', loadChildren: () => import('./reports/reports.routes') }
```

### Defer Blocks (Angular 19)

```html
@defer (on viewport) {
  <app-heavy-chart [data]="chartData" />
} @placeholder {
  <div class="skeleton" />
} @loading (minimum 200ms) {
  <app-spinner />
}
```

- `@defer (on viewport)` — load when element enters viewport.
- `@defer (on interaction)` — load on click/hover.
- `@defer (when condition)` — load when expression is true.

### Bundle Optimization

- Tree-shaking: standalone components + `providedIn: 'root'` = automatic.
- No barrel file re-exports of entire modules.
- Use `ng build --stats-json` to analyze bundle.

## Security

### Built-in XSS Protection

- Angular auto-sanitizes template bindings — safe by default.
- `[innerHTML]` is sanitized, but avoid with user input.
- `bypassSecurityTrust*()` — NEVER use with untrusted data.

### HTTP Security

```ts
// Auth interceptor adds token
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthStore).token();
  const secured = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  return next(secured);
};

// CSRF: Angular HttpClient auto-reads XSRF-TOKEN cookie
provideHttpClient(withXsrfConfiguration({ cookieName: 'XSRF-TOKEN' }))
```

### CSP (Content Security Policy)

- Avoid inline styles in production — configure CSP headers.
- `ngCspNonce` attribute for nonce-based CSP with Angular styles.

### Route Guards

- Use functional guards with `inject()`.
- Protect routes AND verify server-side — guards are client-only.
