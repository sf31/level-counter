import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent, SelectOption } from './select.component';

describe('SelectComponent', () => {
  let fixture: ComponentFixture<SelectComponent>;

  const options: readonly SelectOption[] = [
    { value: 'one', label: 'Option one' },
    { value: 'two', label: 'Option two' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    fixture.componentRef.setInput('controlId', 'test-select');
    fixture.componentRef.setInput('label', 'Choose an option');
    fixture.componentRef.setInput('options', options);
    fixture.componentRef.setInput('value', 'two');
    fixture.detectChanges();
  });

  it('associates its label and displays the selected value', () => {
    const element: HTMLElement = fixture.nativeElement;
    const label = element.querySelector<HTMLLabelElement>('label');
    const select = element.querySelector<HTMLSelectElement>('select');

    expect(label?.htmlFor).toBe('test-select');
    expect(select?.value).toBe('two');
  });

  it('emits the selected value', () => {
    const emittedValues: string[] = [];
    fixture.componentInstance.valueChange.subscribe((value) =>
      emittedValues.push(value),
    );
    const select = fixture.nativeElement.querySelector(
      'select',
    ) as HTMLSelectElement;

    select.value = 'one';
    select.dispatchEvent(new Event('change'));

    expect(emittedValues).toEqual(['one']);
  });
});
