import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-overlay',
  imports: [],
  template: `
    <div class="backdrop" (click)="close.emit()"></div>
    <div
      #panel
      class="panel"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="labelledBy()"
      [attr.aria-describedby]="describedBy()"
      (keydown)="onKeydown($event)"
    >
      <ng-content />
    </div>
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        z-index: 100;
        display: flex;
        align-items: flex-end;
        justify-content: center;
      }

      .backdrop {
        position: fixed;
        inset: 0;
        background-color: var(--color-backdrop);
      }

      .panel {
        position: relative;
        width: 100%;
        max-width: 480px;
        max-height: 85dvh;
        overflow: auto;
        background-color: var(--color-bg-light);
        border-radius: var(--border-radius-2) var(--border-radius-2) 0 0;
        padding: var(--space-lg);
        animation: slideUp var(--duration-slow) ease-out;
      }

      @keyframes slideUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @media (min-width: 600px) {
        :host {
          align-items: center;
        }

        .panel {
          border-radius: var(--border-radius-2);
          max-height: 70dvh;
          animation: fadeIn var(--duration-normal) ease-out;
        }

        @keyframes fadeIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayComponent implements OnDestroy {
  readonly ariaLabel = input<string | null>(null);
  readonly labelledBy = input<string | null>(null);
  readonly describedBy = input<string | null>(null);
  readonly close = output<void>();

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly previouslyFocusedElement =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

  constructor() {
    afterNextRender(() => this.focusDialog());
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close.emit();
      return;
    }

    if (event.key !== 'Tab') return;

    const panel = this.panel()?.nativeElement;
    if (!panel) return;

    const focusableElements = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );

    if (focusableElements.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  ngOnDestroy(): void {
    this.previouslyFocusedElement?.focus();
  }

  private focusDialog(): void {
    const panel = this.panel()?.nativeElement;
    if (!panel) return;

    const firstControl = panel.querySelector<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
    );
    (firstControl ?? panel).focus();
  }
}
