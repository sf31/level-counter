import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { AppService } from '../../core/services/app.service';
import { PwaService } from '../../core/services/pwa.service';
import { PwaUpdateState } from '../../types';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let pwaState$: BehaviorSubject<PwaUpdateState>;

  beforeEach(async () => {
    pwaState$ = new BehaviorSubject<PwaUpdateState>({
      promptEvent: null,
      isRunningStandalone: false,
      installStatus: 'unavailable',
      installError: null,
      updateAvailable: false,
      updateError: null,
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AppService, useValue: { activeParty$: of(undefined) } },
        {
          provide: PwaService,
          useValue: { state$: pwaState$.asObservable() },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
  });

  it('hides the install link after the app is installed', () => {
    const installLink = () => {
      const element = fixture.nativeElement as HTMLElement;
      return Array.from(element.querySelectorAll('nav a')).find((link) =>
        link.textContent?.includes('Install app'),
      );
    };

    expect(installLink()).not.toBeUndefined();

    pwaState$.next({
      ...pwaState$.value,
      installStatus: 'installed',
    });
    fixture.detectChanges();

    expect(installLink()).toBeUndefined();
  });
});
