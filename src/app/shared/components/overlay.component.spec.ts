import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayComponent } from './overlay.component';

describe('OverlayComponent', () => {
  let fixture: ComponentFixture<OverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayComponent);
    fixture.componentRef.setInput('ariaLabel', 'Test dialog');
    fixture.detectChanges();
  });

  it('exposes accessible modal dialog semantics', () => {
    const panel = fixture.nativeElement.querySelector(
      '[role="dialog"]',
    ) as HTMLElement;

    expect(panel.getAttribute('aria-modal')).toBe('true');
    expect(panel.getAttribute('aria-label')).toBe('Test dialog');
  });

  it('closes when Escape is pressed', () => {
    const close = jasmine.createSpy('close');
    fixture.componentInstance.close.subscribe(close);
    const panel = fixture.nativeElement.querySelector(
      '[role="dialog"]',
    ) as HTMLElement;

    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(close).toHaveBeenCalledTimes(1);
  });
});
