import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Settlements } from './settlements';

describe('Settlements page', () => {
  it('updates the displayed settlement after importing a JSON file', async () => {
    await TestBed.configureTestingModule({
      imports: [Settlements],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(Settlements);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(
      [
        JSON.stringify({
          type: 'Tower',
          settlement: {
            wizard: { level: 9, apprentice: { level: 5 } },
            levels: { aboveground: 4, underground: 0, total: 6 },
            connection: { roll: 7, result: 'Ladder' },
            outside: {
              material: { roll: 2, result: 'Cobblestone' },
              shape: { roll: 2, result: 'Square' },
              details: [{ roll: 11, result: 'Balcony' }],
            },
            insideAppearance: { roll: 8, result: 'Old fashioned' },
            specialEquipment: { roll: 10, result: 'Nothing' },
            levelUsage: {
              ground: { roll: 5, result: 'Ruined room' },
              aboveground: [{ roll: 9, result: 'Museum' }],
              top: { roll: 5, result: 'Golden apple tree' },
              underground: [],
              bottom: null,
            },
          },
        }),
      ],
      'settlement.json',
      { type: 'application/json' }
    );
    Object.defineProperty(input, 'files', { value: [file] });
    const event = new Event('change');
    Object.defineProperty(event, 'target', { value: input });

    await fixture.componentInstance.importSettlement(event);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Generated settlement type: Tower'
    );
    expect(fixture.nativeElement.textContent).toContain('Cobblestone');
    expect(fixture.nativeElement.textContent).toContain('Golden apple tree');
    expect(fixture.nativeElement.textContent).not.toContain('Generated settlement type: Hamlet');
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });
});
