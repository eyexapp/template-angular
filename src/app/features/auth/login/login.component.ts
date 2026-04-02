import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-2xl bg-white p-8 shadow-xl">
      <h2 class="text-center text-2xl font-bold text-gray-900">{{ 'auth.loginTitle' | translate }}</h2>
      <p class="mt-2 text-center text-sm text-gray-600">{{ 'auth.loginSubtitle' | translate }}</p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            {{ 'auth.email' | translate }}
          </label>
          <input
            id="email"
            type="email"
            formControlName="email"
            autocomplete="email"
            class="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            [placeholder]="'auth.emailPlaceholder' | translate"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            {{ 'auth.password' | translate }}
          </label>
          <input
            id="password"
            type="password"
            formControlName="password"
            autocomplete="current-password"
            class="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            [placeholder]="'auth.passwordPlaceholder' | translate"
          />
        </div>

        @if (errorMessage()) {
          <div class="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {{ errorMessage() }}
          </div>
        }

        <button
          type="submit"
          [disabled]="form.invalid || authService.isLoading()"
          class="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          @if (authService.isLoading()) {
            <span class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          } @else {
            {{ 'auth.login' | translate }}
          }
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500">
        {{ 'auth.noAccount' | translate }}
        <a routerLink="/auth/register" class="font-medium text-blue-600 hover:text-blue-500">
          {{ 'auth.register' | translate }}
        </a>
      </p>
    </div>
  `,
})
export class LoginComponent {
  protected readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly errorMessage = signal('');

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    const { email, password } = this.form.getRawValue();
    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        if (response) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage.set('Invalid credentials');
        }
      },
      error: () => this.errorMessage.set('Login failed. Please try again.'),
    });
  }
}
