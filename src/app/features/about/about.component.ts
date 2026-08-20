import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <section>
      <h1>About</h1>
      <p>LevelCounter keeps track of levels and gear in board games.</p>
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
export class AboutComponent {}
