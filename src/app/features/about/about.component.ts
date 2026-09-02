import { ChangeDetectionStrategy, Component } from '@angular/core';
import { APP_VERSION } from '../../const';

@Component({
  selector: 'app-about',
  imports: [],
  template: `
    <section class="about">
      <div class="content">
        <p class="brand">
          <span class="brand-level">Level</span
          ><span class="brand-counter">Counter</span>
        </p>
        <p>Track level and gear for multiple players and parties.</p>
        <p>Works offline without account and ads.</p>
        <a
          class="link"
          href="https://github.com/sf31/level-counter"
          target="_blank"
          rel="noopener noreferrer"
          >See on GitHub ↗</a
        >
      </div>
      <p class="version">version {{ version }}</p>
    </section>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .about {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: var(--space-xl) var(--space-md);
        gap: var(--space-lg);
      }

      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-sm);
      }

      .brand {
        margin: 0;
        font-size: var(--font-size-display);
        font-weight: var(--font-weight-strong);
      }

      .brand-level {
        color: var(--color-accent);
      }

      .brand-counter {
        color: var(--color-text-muted);
      }

      .link {
        color: var(--color-accent);
        text-decoration: none;
        margin-top: var(--space-sm);
      }

      .version {
        text-align: center;
        color: var(--color-text-muted);
        font-size: var(--font-size-caption);
        user-select: text;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  protected readonly version = APP_VERSION;
}
