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
});
