---
name: version-control
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - git
  - commit
  - ci
  - build
  - deploy
---

# Version Control — Angular 19

## Commits (Conventional)

`<type>(<scope>): <description>`

Examples:
- `feat(auth): add signal-based login store`
- `fix(http): handle 401 in auth interceptor`
- `refactor(dashboard): migrate to standalone components`

## CI Pipeline

1. `npm ci`
2. `npx tsc --noEmit` — type check
3. `ng lint` — Angular ESLint
4. `ng test --watch=false --code-coverage` — Jest
5. `ng build --configuration=production` — production build

## Build

- Angular CLI: `ng build` → `dist/` folder.
- `environment.ts` / `environment.prod.ts` for env-specific config.
- `fileReplacements` in `angular.json` for build-time env swapping.
- Bundle analysis: `ng build --stats-json` + `webpack-bundle-analyzer`.

## .gitignore

```
node_modules/
dist/
.angular/
coverage/
```

## Migration Notes

- `ng update @angular/cli @angular/core` — keep Angular updated.
- `ng generate` scaffolds standalone components by default.
