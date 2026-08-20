import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  template: `
    <section>
      <h1>Settings</h1>
      <p>No app settings are available yet.</p>
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
export class SettingsComponent {}
