import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { PwaComponent } from './pwa.component';
import { PwaService } from '../../core/services/pwa.service';
import { AppService } from '../../core/services/app.service';
import { PwaUpdateState } from '../../types';

describe('PwaComponent', () => {
  let fixture: ComponentFixture<PwaComponent>;

  const pwaState: PwaUpdateState = {
    promptEvent: null,
    isRunningStandalone: false,
    installStatus: 'unavailable',
    installError: null,
    updateAvailable: false,
    updateError: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwaComponent],
      providers: [
        {
          provide: PwaService,
          useValue: {
            state$: of(pwaState),
            install: jasmine.createSpy('install'),
          },
        },
        {
          provide: AppService,
          useValue: { patchState: jasmine.createSpy('patchState') },
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PwaComponent);
    fixture.detectChanges();
  });

  it('shows only the selected browser instructions', () => {
    const element: HTMLElement = fixture.nativeElement;
    const select = element.querySelector<HTMLSelectElement>('#install-guide');

    expect(select).not.toBeNull();
    expect(element.querySelectorAll('.manual-install section')).toHaveSize(1);

    select!.value = 'firefox-android';
    select!.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(element.querySelectorAll('h1')).toHaveSize(1);
    expect(element.querySelector('h1')?.textContent).toContain(
      'Firefox — Android',
    );
    const visibleSteps =
      element.querySelector('.manual-install ol')?.textContent;
    expect(visibleSteps).toContain('Tap Install');
    expect(visibleSteps).not.toContain('Add to Dock');
  });

  it('sorts the choices by browser and then platform', () => {
    const element: HTMLElement = fixture.nativeElement;
    const options = Array.from(
      element.querySelectorAll<HTMLOptionElement>('#install-guide option'),
      (option) => option.textContent?.trim(),
    );

    expect(options).toEqual([
      'Chrome / Edge — Android',
      'Chrome / Edge — Linux, macOS, Windows',
      'Firefox — Android',
      'Firefox — Linux/macOS (not supported)',
      'Firefox — Windows',
      'Safari — iPhone/iPad',
      'Safari — macOS',
      'Other browser/device',
    ]);
  });
});
