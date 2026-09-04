import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlusMinusComponent } from './plus-minus.component';

describe('PlusMinusComponent', () => {
  let fixture: ComponentFixture<PlusMinusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlusMinusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlusMinusComponent);
    fixture.componentRef.setInput('label', 'level');
    fixture.componentRef.setInput('value', 4);
    fixture.detectChanges();
  });

  it('provides labelled keyboard controls for changing the value', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(buttons.length).toBe(2);
    expect(buttons[0].getAttribute('aria-label')).toBe('Increase level');
    expect(buttons[1].getAttribute('aria-label')).toBe('Decrease level');
  });

  it('emits changes from the native buttons', () => {
    const plus = jasmine.createSpy('plus');
    const minus = jasmine.createSpy('minus');
    fixture.componentInstance.plus.subscribe(plus);
    fixture.componentInstance.minus.subscribe(minus);
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;

    buttons[0].click();
    buttons[1].click();

    expect(plus).toHaveBeenCalledTimes(1);
    expect(minus).toHaveBeenCalledTimes(1);
  });
});
