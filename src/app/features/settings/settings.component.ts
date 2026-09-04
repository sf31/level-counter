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
    <section aria-label="Settings" i18n-aria-label>
      <app-select
        class="prominent-label"
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
