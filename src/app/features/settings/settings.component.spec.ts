import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocaleService } from '../../core/services/locale.service';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        {
          provide: LocaleService,
          useValue: {
            currentLocale: 'en',
            switchLocale: jasmine.createSpy('switchLocale'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();
  });

  it('uses an accessible section label without rendering a page heading', () => {
    const element: HTMLElement = fixture.nativeElement;
    const section = element.querySelector('section');

    expect(section?.getAttribute('aria-label')).toBe('Settings');
    expect(element.querySelector('h1')).toBeNull();
  });

  it('opts the language selector into prominent label styling', () => {
    const selector = fixture.nativeElement.querySelector('app-select');

    expect(selector?.classList.contains('prominent-label')).toBeTrue();
  });
});
