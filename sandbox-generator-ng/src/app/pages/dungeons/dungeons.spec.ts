import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Dungeons } from './dungeons';

describe('Dungeons page', () => {
  it('renders the generated areas, levels, room counts, and links in the cross-section', async () => {
    await TestBed.configureTestingModule({
      imports: [Dungeons],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(Dungeons);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const dungeon = component.dungeon();
    expect(dungeon).not.toBeNull();
    if (!dungeon) {
      throw new Error('The dungeon should be generated when the page initializes.');
    }
    const diagram = fixture.nativeElement.querySelector(
      'svg.cross-section-svg',
    ) as SVGElement;

    expect(diagram).not.toBeNull();
    expect(diagram.querySelectorAll('.cross-section-area').length).toBe(dungeon.areas.length);
    expect(diagram.querySelectorAll('.cross-section-depth').length).toBe(6);
    expect(diagram.querySelectorAll('.cross-section-level').length).toBe(
      dungeon.areas.reduce((count, area) => count + area.levels.length, 0),
    );
    expect(diagram.querySelectorAll('.cross-section-connection').length).toBe(
      dungeon.links.length,
    );
    const depthLabel = diagram.querySelector('.cross-section-depth')!;
    const firstLevel = diagram.querySelector('.cross-section-level rect')!;
    expect(Number(depthLabel.getAttribute('x'))).toBeLessThan(
      Number(firstLevel.getAttribute('x')),
    );

    component.areaCount.set(3);
    component.onGenerateDungeon();
    fixture.detectChanges();

    const updatedDiagram = fixture.nativeElement.querySelector(
      'svg.cross-section-svg',
    ) as SVGElement;
    expect(updatedDiagram.querySelectorAll('.cross-section-area').length).toBe(3);
  });

  it('offers random and fixed maximum depths and applies the selected cap', async () => {
    await TestBed.configureTestingModule({
      imports: [Dungeons],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(Dungeons);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const select = fixture.nativeElement.querySelector('.max-depth') as HTMLSelectElement;

    expect(Array.from(select.options).map((option) => option.textContent?.trim())).toEqual([
      'Random',
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
    ]);
    expect(select.value).toBe('random');
    expect(component.maxDepth()).toBeNull();

    select.value = '2';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.maxDepth()).toBe(2);

    component.onGenerateDungeon();
    const dungeon = component.dungeon();
    expect(dungeon).not.toBeNull();
    for (const level of dungeon!.areas.flatMap((area) => area.levels)) {
      expect(level.depth).toBeLessThanOrEqual(2);
    }

    select.value = 'random';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.maxDepth()).toBeNull();
  });

  it('offers random and fixed level counts per area', async () => {
    await TestBed.configureTestingModule({
      imports: [Dungeons],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(Dungeons);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const select = fixture.nativeElement.querySelector('.level-count') as HTMLSelectElement;

    expect(Array.from(select.options).map((option) => option.textContent?.trim())).toEqual([
      'Random',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
    ]);
    expect(select.value).toBe('random');
    expect(component.levelCount()).toBeNull();

    select.value = '3';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.levelCount()).toBe(3);

    component.onGenerateDungeon();
    const dungeon = component.dungeon();
    expect(dungeon).not.toBeNull();
    for (const area of dungeon!.areas) {
      expect(area.levels).toHaveSize(3);
    }

    select.value = 'random';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.levelCount()).toBeNull();
  });

  it('lets the room count follow the book, a fixed value, or a minimum-maximum range', async () => {
    await TestBed.configureTestingModule({
      imports: [Dungeons],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(Dungeons);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const select = fixture.nativeElement.querySelector('.room-count-mode') as HTMLSelectElement;

    expect(Array.from(select.options).map((option) => option.textContent?.trim())).toEqual([
      'Book (2d20+10)',
      'Custom',
    ]);
    expect(select.value).toBe('book');
    expect(fixture.nativeElement.querySelector('.custom-room-count-mode')).toBeNull();
    expect(fixture.nativeElement.querySelector('.min-room-count-value')).toBeNull();

    // The book mode rolls 2d20+10, so levels stay within its 12..50 range.
    component.onGenerateDungeon();
    for (const level of component.dungeon()!.areas.flatMap((area) => area.levels)) {
      expect(level.roomCount).toBeGreaterThanOrEqual(12);
      expect(level.roomCount).toBeLessThanOrEqual(50);
    }

    select.value = 'custom';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const customSelect = fixture.nativeElement.querySelector(
      '.custom-room-count-mode',
    ) as HTMLSelectElement;
    expect(Array.from(customSelect.options).map((option) => option.textContent?.trim())).toEqual([
      'Fixed',
      'Minimum and maximum',
    ]);
    expect(customSelect.value).toBe('range');

    const minInput = fixture.nativeElement.querySelector(
      '.min-room-count-value',
    ) as HTMLInputElement;
    const maxInput = fixture.nativeElement.querySelector(
      '.max-room-count-value',
    ) as HTMLInputElement;
    expect(minInput.value).toBe('12');
    expect(maxInput.value).toBe('20');

    minInput.value = '5';
    minInput.dispatchEvent(new Event('input'));
    maxInput.value = '9';
    maxInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.minRoomCount()).toBe(5);
    expect(component.maxRoomCount()).toBe(9);

    component.onGenerateDungeon();
    for (const level of component.dungeon()!.areas.flatMap((area) => area.levels)) {
      expect(level.roomCount).toBeGreaterThanOrEqual(5);
      expect(level.roomCount).toBeLessThanOrEqual(9);
    }

    // A range typed back to front still generates instead of throwing.
    minInput.value = '9';
    minInput.dispatchEvent(new Event('input'));
    maxInput.value = '5';
    maxInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    component.onGenerateDungeon();
    for (const level of component.dungeon()!.areas.flatMap((area) => area.levels)) {
      expect(level.roomCount).toBeGreaterThanOrEqual(5);
      expect(level.roomCount).toBeLessThanOrEqual(9);
    }

    customSelect.value = 'fixed';
    customSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.customRoomCountMode()).toBe('fixed');
    expect(fixture.nativeElement.querySelector('.min-room-count-value')).toBeNull();

    const fixedInput = fixture.nativeElement.querySelector(
      '.room-count-value',
    ) as HTMLInputElement;
    fixedInput.value = '7';
    fixedInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    component.onGenerateDungeon();
    for (const level of component.dungeon()!.areas.flatMap((area) => area.levels)) {
      expect(level.roomCount).toBe(7);
    }

    select.value = 'book';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.roomCountMode()).toBe('book');
    expect(fixture.nativeElement.querySelector('.custom-room-count-mode')).toBeNull();
    expect(fixture.nativeElement.querySelector('.room-count-value')).toBeNull();
  });
});
