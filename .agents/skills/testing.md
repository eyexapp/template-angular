---
name: testing
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - test
  - jest
  - testing
  - component test
  - service test
  - mock
---

# Testing — Angular 19 (Jest + Angular Testing Library)

## Component Testing

```ts
import { render, screen } from '@testing-library/angular';
import { UserCardComponent } from './user-card.component';

it('should render user name', async () => {
  await render(UserCardComponent, {
    componentInputs: { user: { name: 'Alice' } },
  });
  expect(screen.getByText('Alice')).toBeInTheDocument();
});
```

## Service Testing

```ts
it('should return users', () => {
  const httpMock = TestBed.inject(HttpTestingController);
  const service = TestBed.inject(UserService);

  service.getUsers().subscribe(users => {
    expect(users).toHaveLength(3);
  });

  httpMock.expectOne('/api/users').flush(mockUsers);
});
```

## Signal Store Testing

```ts
it('should update state on login', async () => {
  TestBed.configureTestingModule({ providers: [AuthStore] });
  const store = TestBed.inject(AuthStore);

  expect(store.isAuthenticated()).toBe(false);
  await store.login({ email: 'a@b.com', password: 'pass' });
  expect(store.isAuthenticated()).toBe(true);
});
```

## Guard Testing

```ts
it('should redirect unauthenticated users', () => {
  const guard = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
  expect(guard).toEqual(jasmine.any(UrlTree));
});
```

## Mocking

- `provideHttpClientTesting()` — mock HTTP requests.
- `{ provide: AuthService, useValue: mockAuthService }` — replace services.
- `componentInputs` — set signal inputs directly in tests.
- Use `TestBed.runInInjectionContext()` for testing functional guards/interceptors.

## Rules

- Prefer Angular Testing Library over raw TestBed for components.
- Test signal reactivity: update signal → assert computed/effect behavior.
- Mock HTTP with `HttpTestingController`, not by replacing HttpClient.
