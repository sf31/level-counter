import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  SelectComponent,
  SelectOption,
} from '../../shared/components/select.component';
import {
  isSupportedLocale,
  LOCALE_LABELS,
  LocaleService,
  SUPPORTED_LOCALES,
} from '../../core/services/locale.service';

@Component({
  selector: 'app-settings',
  imports: [SelectComponent],
  template: `
    <section aria-labelledby="settings-title">
      <h1 id="settings-title" i18n>Settings</h1>
      <app-select
        controlId="language"
        [label]="languageLabel"
        [options]="languageOptions"
        [value]="selectedLocale"
        (valueChange)="changeLocale($event)"
      />
    </section>
  `,
  styles: [
    `
      section {
        padding: var(--space-xl) var(--space-md);
        text-align: center;
      }

      h1 {
        margin: 0;
        font-size: var(--font-size-page-title);
      }

      p {
        color: var(--color-text-muted);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly locale = inject(LocaleService);

  protected readonly selectedLocale = this.locale.currentLocale;
  protected readonly languageLabel = $localize`Language`;
  protected readonly languageOptions: readonly SelectOption[] =
    SUPPORTED_LOCALES.map((locale) => ({
      value: locale,
      label: LOCALE_LABELS[locale],
    }));

  protected changeLocale(value: string): void {
    if (isSupportedLocale(value)) {
      this.locale.switchLocale(value);
    }
  }
}
