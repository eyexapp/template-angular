import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 class="text-8xl font-bold text-gray-200">404</h1>
      <h2 class="mt-4 text-2xl font-semibold text-gray-700">{{ 'notFound.title' | translate }}</h2>
      <p class="mt-2 text-gray-500">{{ 'notFound.description' | translate }}</p>
      <a routerLink="/" class="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700">
        {{ 'notFound.backHome' | translate }}
      </a>
    </div>
  `,
})
export class NotFoundComponent {}
