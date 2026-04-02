import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<router-outlet />`,
})
export class App implements OnInit {
  private readonly translate = inject(TranslateService);

  ngOnInit(): void {
    const savedLang = localStorage.getItem('app_language');
    const lang = savedLang ?? environment.defaultLanguage;
    this.translate.addLangs(environment.supportedLanguages);
    this.translate.setDefaultLang(environment.defaultLanguage);
    this.translate.use(lang);
  }
}
