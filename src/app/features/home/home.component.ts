import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="py-12">
      <!-- Hero section -->
      <section class="text-center">
        <h1 class="text-5xl font-bold tracking-tight text-gray-900">
          {{ 'home.title' | translate }}
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          {{ 'home.subtitle' | translate }}
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="https://angular.dev"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            {{ 'home.getStarted' | translate }}
          </a>
          <a
            href="https://angular.dev/tutorials"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600"
          >
            {{ 'home.learnMore' | translate }} &rarr;
          </a>
        </div>
      </section>

      <!-- Features section -->
      <section class="mt-24">
        <h2 class="text-center text-3xl font-bold text-gray-900">{{ 'home.features' | translate }}</h2>
        <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          @for (feature of features; track feature.key) {
            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl">
                {{ feature.icon }}
              </div>
              <h3 class="mt-4 text-lg font-semibold text-gray-900">
                {{ 'home.featureList.' + feature.key + '.title' | translate }}
              </h3>
              <p class="mt-2 text-sm text-gray-600">
                {{ 'home.featureList.' + feature.key + '.description' | translate }}
              </p>
            </div>
          }
        </div>
      </section>
    </div>
  `,
})
export class HomeComponent {
  readonly features = [
    { key: 'signals', icon: '⚡' },
    { key: 'standalone', icon: '📦' },
    { key: 'tailwind', icon: '🎨' },
    { key: 'i18n', icon: '🌍' },
    { key: 'stateManagement', icon: '🏪' },
    { key: 'cleanArch', icon: '🏗️' },
  ];
}
