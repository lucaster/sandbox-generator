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

  it('offers random, maximum, and fixed room counts per level', async () => {
    await TestBed.configureTestingModule({
      imports: [Dungeons],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(Dungeons);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const select = fixture.nativeElement.querySelector('.room-count-mode') as HTMLSelectElement;

    expect(Array.from(select.options).map((option) => option.textContent?.trim())).toEqual([
      'Random',
      'Maximum',
      'Fixed',
    ]);
    expect(select.value).toBe('random');
    expect(fixture.nativeElement.querySelector('.room-count-value')).toBeNull();

    select.value = 'fixed';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(
      '.room-count-value',
    ) as HTMLInputElement;
    expect(input).not.toBeNull();

    input.value = '7';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.roomCount()).toBe(7);

    component.onGenerateDungeon();
    for (const level of component.dungeon()!.areas.flatMap((area) => area.levels)) {
      expect(level.roomCount).toBe(7);
    }

    select.value = 'max';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const maxInput = fixture.nativeElement.querySelector(
      '.room-count-value',
    ) as HTMLInputElement;
    maxInput.value = '15';
    maxInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    component.onGenerateDungeon();
    for (const level of component.dungeon()!.areas.flatMap((area) => area.levels)) {
      expect(level.roomCount).toBeGreaterThanOrEqual(12);
      expect(level.roomCount).toBeLessThanOrEqual(15);
    }

    select.value = 'random';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.roomCountMode()).toBe('random');
    expect(fixture.nativeElement.querySelector('.room-count-value')).toBeNull();
  });
});
