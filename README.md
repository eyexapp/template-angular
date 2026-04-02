# MyApp — Angular Template

A professional Angular 21+ project template with clean architecture, state management, internationalization, and Tailwind CSS.

## Tech Stack

| Technology | Purpose |
|---|---|
| **Angular 21+** | Framework (standalone components, signals, functional APIs) |
| **NgRx Signal Store** | State management (`@ngrx/signals`) |
| **Tailwind CSS 4** | Utility-first styling |
| **ngx-translate** | Internationalization (i18n) |
| **Vitest** | Unit testing |
| **ESLint** | Code linting (`angular-eslint`) |
| **TypeScript 5.9+** | Strict mode enabled |

## Project Structure

```
src/app/
├── core/               # Singleton services, guards, interceptors
│   ├── guards/         # Route guards (functional CanActivateFn)
│   ├── interceptors/   # HTTP interceptors (functional HttpInterceptorFn)
│   └── services/       # Singleton services (providedIn: 'root')
├── shared/             # Reusable components, pipes, directives
│   ├── components/     # Shared UI components
│   ├── directives/     # Shared directives
│   └── pipes/          # Shared pipes
├── features/           # Feature modules (lazy-loaded)
│   ├── home/           # Home page
│   └── auth/           # Auth feature (login, register)
├── layouts/            # Layout wrappers
│   ├── main-layout/    # Main layout (header + content + footer)
│   └── auth-layout/    # Auth pages layout
├── models/             # TypeScript interfaces & types
├── store/              # NgRx Signal Store definitions
├── app.config.ts       # Application providers
├── app.routes.ts       # Root route definitions
└── app.ts              # Root component
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm start
# → http://localhost:4200

# Build for production
npm run build

# Run tests
npm test

# Lint
npm run lint
npm run lint:fix
```

## Adding a New Feature

1. Create component in `src/app/features/your-feature/`
2. Add lazy-loaded route in `app.routes.ts`
3. Add translation keys to `public/i18n/en.json` and `public/i18n/tr.json`
4. Create store in `src/app/store/` if cross-component state is needed

## Key Conventions

- **100% standalone** — no NgModules
- **OnPush change detection** on every component
- **Signals** for all local state (`signal()`, `computed()`, `input()`, `output()`)
- **Functional guards & interceptors** (`CanActivateFn`, `HttpInterceptorFn`)
- **`inject()`** for dependency injection (not constructor params)
- **`@if`, `@for`, `@switch`** for template control flow
- **Lazy loading** via `loadComponent` / `loadChildren`

## AI Assistant

This project includes `CLAUDE.md` with detailed instructions for AI-assisted development. Claude will follow all architecture conventions automatically.
