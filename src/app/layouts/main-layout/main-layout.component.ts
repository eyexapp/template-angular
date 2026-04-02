import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, TranslateModule, UpperCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a routerLink="/" class="text-xl font-bold text-gray-900">
          {{ 'app.title' | translate }}
        </a>

        <div class="flex items-center gap-4">
          <!-- Language Switcher -->
          <div class="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
            @for (lang of languages; track lang) {
              <button
                (click)="switchLanguage(lang)"
                [class]="translate.currentLang === lang
                  ? 'rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-900 shadow-sm'
                  : 'rounded-md px-3 py-1 text-sm text-gray-500 hover:text-gray-700'"
              >
                {{ lang | uppercase }}
              </button>
            }
          </div>

          <!-- Auth Actions -->
          @if (authService.isAuthenticated()) {
            <span class="text-sm text-gray-600">{{ authService.currentUser()?.displayName }}</span>
            <button
              (click)="authService.logout()"
              class="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              {{ 'auth.logout' | translate }}
            </button>
          } @else {
            <a
              routerLink="/auth/login"
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {{ 'auth.login' | translate }}
            </a>
          }
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="mx-auto min-h-[calc(100vh-8rem)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <router-outlet />
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 bg-gray-50">
      <div class="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
        &copy; {{ currentYear }} {{ 'app.title' | translate }}. {{ 'footer.rights' | translate }}
      </div>
    </footer>
  `,
})
export class MainLayoutComponent {
  protected readonly authService = inject(AuthService);
  protected readonly translate = inject(TranslateService);
  protected readonly languages = environment.supportedLanguages;
  protected readonly currentYear = new Date().getFullYear();

  switchLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('app_language', lang);
  }
}
