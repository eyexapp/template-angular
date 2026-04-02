import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-center p-8">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
    </div>
  `,
})
export class LoadingSpinnerComponent {}
