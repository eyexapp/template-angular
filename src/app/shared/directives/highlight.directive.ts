import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  private readonly el = inject(ElementRef);

  readonly color = input<string>('yellow', { alias: 'appHighlight' });

  constructor() {
    effect(() => {
      this.el.nativeElement.style.backgroundColor = this.color();
    });
  }
}
